+++
title = "Keeping Parsers Readable"
date = 2025-11-26
description = "How to update a parser without introducing tech debt"
[taxonomies]
tags=["osh", "parsing"]
[extra]
unlisted = false
+++

`osh` is a cool shell that's trying to become compatible with `bash`. The `mdev-conf` [alpine linux package](https://pkgs.alpinelinux.org/package/edge/main/armhf/mdev-conf) was failing to build with `osh` as the system shell. Andy and Bram from the [Oils project](https://oils.pub/) traced the **root cause** to the following bug in `osh`'s here doc parser:

<pre><code><symbol>$</symbol> cat bug.sh
<comment># don't understand this syntax? Me neither. Keep reading and I cover it!</comment> 
<session>cat &lt;&lt;EOF
a \"quote\"
EOF</session>

<symbol>$</symbol> osh bug.sh
<session>a "quote"</session>

<symbol>$</symbol> bash bug.sh
<session>a \"quote\"</session>
</code></pre>

Interestingly enough, `toysh`, `sush`, and `brush` all fail in the same way. This seems to be the kind of thing [you need to make your shell **mature**](https://oilshell.zulipchat.com/#narrow/channel/503208-bug-post-mortem/topic/mdev-conf.20-.20.5C.22.20should.20not.20be.20escape.20sequence.20in.20here.20docs/near/553270324).

<div style="text-align: center; margin-bottom: 16px;">
    <div style="margin: auto; display: inline-block; text-align: left;">
        1. <a href="#where-doc">Where doc?</a>
        <br>
        2. <a href="#initial-fix-just-the-parser">Initial fix: just the parser</a>
        <br>
        3. <a href="#second-attempt-both-parser-lexer">Second attempt: both parser & lexer</a>
        <br>
        4. <a href="#what-not-to-do">What not to do</a>
    </div>
</div>

## Where doc?

A [here document](https://www.gnu.org/software/bash/manual/bash.html#Here-Documents) (commonly shortened to here doc) is like a multiline string from the olden days. Seriously, you're gonna say "oh yeah, that sounds like what they'd do back then."

A here doc starts with `<<` followed by a single word. Like `<<MY_END_TOKEN`. After that, all lines of text until `MY_END_TOKEN\n` will comprise a large string.

<pre><code><keyword>$</keyword> <string>&lt;&lt;MY_FANCY_END_TOKEN
This is my cool essay where I can "quote things" without needing to escape them.
Oh the freedom...
MY_FANCY_END_TOKEN</string>
</code></pre>

The only purpose of a here doc is that, when placed after a command, [its contents become the command's stdin](https://www.gnu.org/software/bash/manual/bash.html#Here-Documents:~:text=All%20of%20the%20lines%20read%20up%20to%20that%20point%20then%20become%20the%20standard%20input). A little known fact is that if `cat` is not given an argument, it will echo its stdin. Thus, the easiest way to see the contents of a here doc is to `cat` it. Of course, we can use the pipe to convert stdout into stdin.

<pre><code><keyword>$</keyword> echo <string>"please cat this"</string> | cat
<session>please cat this</session>
</code></pre>

Now, we can display the contents of a here doc using `cat`:

<pre><code><keyword>$</keyword> cat <string>&lt;&lt;MY_FANCY_END_TOKEN
This is my cool essay where I can "quote things" without needing to escape them.
Oh the freedom...
MY_FANCY_END_TOKEN</string>
<session>This is my cool essay where I can "quote things" without needing to escape them.
Oh the freedom...</session>
</code></pre>

Variables even get expanded in here docs:

<pre><code><keyword>$</keyword> x=<const>10</const>
<keyword>$</keyword> y=$((x*<const>2</const>))
<keyword>$</keyword> cat <string>&lt;&lt;END
$x * 2 = $y
END</string>
<session>10 * 2 = 20</session>
</code></pre>

## Initial fix: just the parser

Now that we've learned some cursed `bash` knowledge, lets fix `osh`'s parser. Game plan:
- Dive into `osh`'s parser and figure out where it converts `\"` into `"`.
- Don't.

Seems simple enough?

I was quickly able to find where here docs are parsed. It mostly shares functionality with the parsing of double quote strings.

<pre><code><keyword>def</keyword> <symbol>ReadHereDocBody</symbol><bra>(</bra>self, parts<bra>)</bra>:
    <comment># type: (List[word_part_t]) -> None</comment>
    <string>"""
    A here doc is like a double quoted context, except " and \" aren't special.
    """</string>
    self.<symbol>_ReadLikeDQ</symbol><bra>(</bra><const>None</const>, <const>False</const>, parts<bra>)</bra>
</code></pre>

We can then use `osh`'s awesome utility `osh --tool tokens` to peek at the results of the tokenization step.

<pre><code><keyword>$</keyword> osh --tool tokens
cat <string>&lt;&lt;END
hello! \" \$ \\
END</string><session>
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
(16 tokens)</session>
</code></pre>

`\"` is converted into a `Lit_EscapedChar` token, so we just need to add some logic to treat this differently. Sure enough `_ReadLikeDQ` has a clause predicated on `Id.Lit_EscapedChar` which extracts the second character in the token's string. We can simply replace the escaped char token with a token literal during parsing, and the problem is resolved!

<pre><code> <keyword>if</keyword> <const>self</const>.token_type <op>==</op> Id.Lit_EscapedChar:
     ch = lexer.<symbol>TokenSliceLeft</symbol><bra>(</bra>tok, <const>1</const><bra>)</bra>
<addition>+    <keyword>if</keyword> ch <op>==</op> <string>'"'</string> <op>and</op> is_here_doc:</addition>
<addition>+        tok.id <op>=</op> Id.Lit_Chars</addition>
<addition>+        part <op>=</op> tok</addition>
<addition>+    <keyword>else</keyword>:</addition>
<removal >-    part <op>=</op> word_part.<symbol>EscapedLiteral</symbol><bra>(</bra>tok, ch<bra>)</bra>  <comment># type: word_part_t</comment></removal>
<addition>+        part <op>=</op> word_part.<symbol>EscapedLiteral</symbol><bra>(</bra>tok, ch<bra>)</bra>  <comment># type: word_part_t</comment></addition>
</code></pre>

Easy. Simple. 2 line change. All `osh` tests pass with flying colours.

Actually, it's worthwhile to mention how helpful the [`osh` test suite](https://web.archive.org/web/20251128184718/https://op.oilshell.org/uuu/github-jobs/10842/) is for making quick changes like these. I wasn't sure whether introducing sequential `Lit_Chars` tokens like we do above into the result of `_ReadLikeDQ` might break an implicit assumption somewhere else. However, these assumptions are either included in tests or considered bugs.

## Second attempt: both parser & lexer

Nothing in life is easy. Any idea what's wrong with this code change? I'll give you 3 seconds to try to think up some weird reason... Okay, time's up!

This code is [pretty good](https://youtu.be/VuG4QhA89es?si=7XEKoC2QZVZ6080J&t=1577) but it's breaking a contract between `osh`'s parser and its lexer.

In an interpreter the source code passed to it will touch 3 main parts, in order:
- **Lexer** -> processing strings sucks. It's horrible. Turn strings into tokens right at the start and live a good life (and also keep the parser fast).
- **Parser** -> turn your stream of tokens into an AST. In our case we're a leaf node, so we get away with returning a list of "parts," where an escaped character is one part.
- **Evaluator** -> make your AST nodes do the thing they're supposed to. Evaluating a command? Get your arguments, lookup the binary, then start that subprocess! Evaluating a here doc? Turn it into a string & pass it on.

Now remember 2 moments ago when we said strings suck so they shouldn't be in the parser? We check `ch == '"'` above. Why did we put strings in the parser?!

Instead, lets update our lexer's rule to turn `\"` into `Lit_BackslashDoubleQuote`. Then when it's time to convert, we compare tokens, not strings.

<pre><code> <comment># DQ stands for "double quote." Here docs share the same lexer rule as double quoted strings.</comment>
 LEXER_DEF<bra>[</bra>lex_mode_e.DQ<bra>]</bra> <op>=</op> <bra>[</bra>
     <comment># R(...) stands for regex</comment>
<removal >-    <symbol>R</symbol><bra>(</bra><string>r'\\[$`"\\]'</string>, Id.Lit_EscapedChar<bra>)</bra>,</removal>
<addition>+    <symbol>R</symbol><bra>(</bra><string>r'\\[$`\\]'</string>, Id.Lit_EscapedChar<bra>)</bra>,</addition>
     <comment># C(...) stands for constant</comment>
<addition>+    <symbol>C</symbol><bra>(</bra><string>'\\"'</string>, Id.Lit_BackslashDoubleQuote<bra>)</bra>,</addition>
     <symbol>C</symbol><bra>(</bra><string>'\\\n'</string>, Id.Ignored_LineCont<bra>)</bra>,
     <symbol>C</symbol><bra>(</bra><string>'\\'</string>, Id.Lit_BadBackslash<bra>)</bra>,  <comment># syntax error in YSH, but NOT in OSH</comment>
 <bra>]</bra> <op>+</op> _LEFT_SUBS <op>+</op> _VARS <op>+</op> <bra>[</bra>
     <symbol>R</symbol><bra>(</bra><string>r'[^$`"\0\\]+'</string>, Id.Lit_Chars<bra>)</bra>,  <comment># matches a line at most</comment>
     <symbol>C</symbol><bra>(</bra><string>'$'</string>, Id.Lit_Dollar<bra>)</bra>,  <comment># completion of var names relies on this</comment>
     <comment># NOTE: When parsing here doc line, this token doesn't end it.</comment>
     <symbol>C</symbol><bra>(</bra><string>'"'</string>, Id.Right_DoubleQuote<bra>)</bra>,
 ]
</code></pre>

Then update the parser as well.

<pre><code>  <keyword>if</keyword> <const>self</const>.token_type <op>==</op> Id.Lit_EscapedChar:
     ch <op>=</op> lexer.<symbol>TokenSliceLeft</symbol><bra>(</bra>tok, <const>1</const><bra>)</bra>
     part <op>=</op> word_part.<symbol>EscapedLiteral</symbol><bra>(</bra>tok, ch<bra>)</bra>  <comment># type: word_part_t</comment>
<addition>+
+ <keyword>elif</keyword> <const>self</const>.token_type <op>==</op> Id.Lit_BackslashDoubleQuote:
+    <keyword>if</keyword> left_token:
+        ch <op>=</op> lexer.<symbol>TokenSliceLeft</symbol><bra>(</bra>tok, <const>1</const><bra>)</bra>
+        part <op>=</op> word_part.<symbol>EscapedLiteral</symbol><bra>(</bra>tok, ch<bra>)</bra>
+    <keyword>else</keyword>:
+        <comment># in here docs \" should not be escaped, staying as literal characters</comment>
+        tok.id <op>=</op> Id.Lit_Chars
+        part <op>=</op> tok</addition>
</code></pre>

## What not to do

While our new change looks good, there's a third way to do it. The wrong way. We could have implemented our fix by modifying only the evaluator, like so:

1. Mark all `EscapedLiteral` if they're part of here docs.
2. During evaluation, replace any `"` with `\"`, undoing the original behaviour the parser.

This approach also solves the string escaping problem, but introduces a new seriously bad side-effect...

One might assume each interpreted line of code is lexed, parsed, and evaluated each time it's run. While this is possible, no serious interpreter works this way! Typically, lexing and parsing is only performed once, while *evaluation* is performed dynamically. We can see this distinction in the short example:

<pre><code><keyword>$</keyword> cat ./test.sh
<session>#!./bin/osh

for i in $(seq 1 4); do
cat &lt;&lt;END
    loop \"$i\"
END
done</session>
</code></pre>

I then added a few trace statements to `osh` so we can see what's going on inside. Running this code now shows that we were partially right! `ReadHereDocBody()` only gets parsed once, but the same string is evaluated multiple times. Our hypothetical change would be to `EscapedLiteral`, so it really would be run each loop iteration.

<pre><code><keyword>$</keyword> ./test.sh
<session><comment># This is the parsing stage for here docs</comment>
in ReadHereDocBody()

in _EvalWordPart('    loop ') @ Literal
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\n') @ Literal
    loop \"1\"

in _EvalWordPart('    loop ') @ Literal
<comment># Look! Look! Our escaped literals got evaluated a second time</comment>
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\n') @ Literal
    loop \"2\"

in _EvalWordPart('    loop ') @ Literal
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\n') @ Literal
    loop \"3\"

in _EvalWordPart('    loop ') @ Literal
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\\"') @ EscapedLiteral
in _EvalWordPart('\n') @ Literal
    loop \"4\"</session>
</code></pre>

The **seriously bad side-effect** from before was that evaluation can be performed over and over again if it's in a loop, or a repeated function call. Of course the performance of a few ops is almost nothing, but as a principle, it's great our fix didn't have to change the evaluator at all!

Nothing like a good feeling.
