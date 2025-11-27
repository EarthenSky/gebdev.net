+++
title = "Keeping Parsers Readable"
date = 2025-11-26
description = "How to update a parser without introducing tech debt"
[taxonomies]
tags=["osh", "parsing"]
[extra]
unlisted = true
+++

`osh` is a cool shell that's trying to become compatible with `bash`. The `mdev-conf` [alpine linux package](https://pkgs.alpinelinux.org/package/edge/main/armhf/mdev-conf) was failing to build with `osh` as the system shell. Graciously tag-team debugged by Andy and Bram from the [Oils project](https://oils.pub/), they found the **root cause** was the following bug in `osh` here doc parser.

<pre><code><const>$</const> cat bug.sh
<comment># don't understand this syntax? me neither. keep reading and I cover it.</comment> 
<session>cat &lt;&lt;EOF
a \"quote\"
EOF</session>

<const>$</const> osh bug.sh
<session>a "quote"</session>

<const>$</const> bash bug.sh
<session>a \"quote\"</session>
</code></pre>

Interestingly enough, `toysh`, `sush`, and `brush` all fail in the same way. This seems to be the kind of thing [you need to make your shell **mature**](https://oilshell.zulipchat.com/#narrow/channel/503208-bug-post-mortem/topic/mdev-conf.20-.20.5C.22.20should.20not.20be.20escape.20sequence.20in.20here.20docs/near/553270324).

<div style="text-align: center; margin-bottom: 16px;">
    <div style="margin: auto; display: inline-block; text-align: left;">
        1. <a href="#where-document">Where document?</a>
        <br>
        2. <a href="#the-parser-has-been-defeated">The parser has been defeated!</a>
        <br>
        3. <a href="#future-proofing">Future proofing</a>
    </div>
</div>

## Where document?

A here document is like a multiline string from the olden days. Seriously, I'll explain it and you're gonna say "oh yeah, that sounds like what they'd do."

A here document as three parts:
1. The first line starts with a `<<` followed by **any string** that doesn't contain a newline or spaces.
2. After that, every line is considered a string character.
3. The last line is a copy of that string from before.

Finally, here documents placed after a command pass their contents as stdin. The easiest way to use a here doc to `cat` it. A little known fact is that if `cat` is not provided a filename, it will repeat whatever it's provided from stdin. Of course, we can use the pipe to convert stdout from a command into stdin.

```sh
$ echo "please cat this" | cat
```

Thus, we can display the contents of a here doc using `cat` as follows:

```
$ cat <<MY_FANCY_END_TOKEN
This is my cool essay where I can "quote things" without needing to escape them.
Oh the freedom
MY_FANCY_END_TOKEN
```

You can even put variables in here documents

```sh
$ x=10
$ y=$((x*2))

$ cat <<END
$x * 2 = $y
END
```

## The parser has been defeated!

Now that you've learned some cursed `bash` knowledge, lets fix `osh`'s parser. Time for a game plan:
- Dive into `osh`'s parser and figure out where it converts `\"` into `"`.
- Don't.

Seems simple enough? Luckily `osh` has `osh --tool tokens`, which lets us start by peeking into the result of the tokenization step.

```sh
$ osh --tool tokens
cat <<END
hello! \" \$ \\
END
    0 Lit_Chars            'cat'
    1 WS_Space             ' '
    2 Redir_DLess          '<<'
    3 Lit_Chars            'END'
    4 Op_Newline           '\n'
    5 Lit_Chars            'hello! '
    6 Lit_EscapedChar      '\\"'
    7 Lit_Chars            ' '
    8 Lit_EscapedChar      '\\$'
    9 Lit_Chars            ' '
   10 Lit_EscapedChar      '\\\\'
   11 Lit_Chars            '\n'
   12 Eof_Real             ''
   13 Lit_CharsWithoutPrefix ''
   14 Undefined_Tok        'END\n'
   15 Eof_Real             ''
(16 tokens)
```

Okay, so `\"` is a `Lit_EscapedChar`. Let's search for this token and see if we can find the parsing step.

Only 14 results, nice. Hmm, nothing particularly jumps out though.

If you were smart (unlike me) you might think to grep "here doc" which would nicely land you at

```py
def ReadHereDocBody(self, parts):
    # type: (List[word_part_t]) -> None
    """
    A here doc is like a double quoted context, except " and \" aren't special.
    """
    self._ReadLikeDQ(None, False, parts)
```

Okay cool, so this is the parser. OH, and `Lit_EscapedChar` is in `_ReadLikeDQ`! This must be it!

Long story short, we can simply replace the escaped literal character with a regular literal token during parsing, and the problem is resolved!

```diff
if self.token_type == Id.Lit_EscapedChar:
    ch = lexer.TokenSliceLeft(tok, 1)
+   if ch == '"' and is_here_doc:
+       tok.id = Id.Lit_Chars
+       part = tok
+   else:
-   part = word_part.EscapedLiteral(tok, ch)  # type: word_part_t
+       part = word_part.EscapedLiteral(tok, ch)  # type: word_part_t
```

Easy. Simple. 2 line change. Tests pass with flying colours.

## Future proofing

But nothing in life is easy. Any idea what's wrong with this code change? Take 3 seconds to see if you can think of some weird example... Okay, time's up!

This code is [pretty good](https://youtu.be/VuG4QhA89es?si=7XEKoC2QZVZ6080J&t=1577) but it's breaking a contract between `osh`'s parser and its lexer.

A cool interpreter has 3 main parts which the data touches in order:
- **Lexer** -> processing strings sucks. It's horrible. Turn strings into tokens right at the start and live a good life (and also keep the parser fast).
- **Parser** -> turn your stream of tokens into an AST. Actually in our case we're a leaf node, so we return a sequence of "parts" that make up what is essentially a single AST node.
- **Evaluator** -> make your AST nodes do the thing they're supposed to. Evaluating a command? Get your arguments, lookup the binary, then start that subprocess! Evaluating a here doc? Turn it into a string & pass it on.

Remember 2 moments ago when we said strings suck so they shouldn't be in the parser? We do `ch == '"'` above. Why are strings in the parser!

Instead, lets update the parser to turn `\"` into `Lit_BackslashDoubleQuote` tokens during here docs.

```diff
 # DQ stands for "double quote." Here docs share the same lexer rule as double quoted strings.
 LEXER_DEF[lex_mode_e.DQ] = [
-    R(r'\\[$`"\\]', Id.Lit_EscapedChar),
+    R(r'\\[$`\\]', Id.Lit_EscapedChar),
+    C('\\"', Id.Lit_BackslashDoubleQuote),
     C('\\\n', Id.Ignored_LineCont),
     C('\\', Id.Lit_BadBackslash),  # syntax error in YSH, but NOT in OSH
 ] + _LEFT_SUBS + _VARS + [
     R(r'[^$`"\0\\]+', Id.Lit_Chars),  # matches a line at most
     C('$', Id.Lit_Dollar),  # completion of var names relies on this
     # NOTE: When parsing here doc line, this token doesn't end it.
     C('"', Id.Right_DoubleQuote),
 ]
```

Then update the parser as well.

```diff
 if self.token_type == Id.Lit_EscapedChar:
     ch = lexer.TokenSliceLeft(tok, 1)
     part = word_part.EscapedLiteral(tok, ch)  # type: word_part_t
+
+ elif self.token_type == Id.Lit_BackslashDoubleQuote:
+    if left_token:
+        ch = lexer.TokenSliceLeft(tok, 1)
+        part = word_part.EscapedLiteral(tok, ch)
+    else:
+        # in here docs \" should not be escaped, staying as literal characters
+        tok.id = Id.Lit_Chars
+        part = tok
```

And we didn't have to change the evaluator at all!

Nothing like a good feeling.
