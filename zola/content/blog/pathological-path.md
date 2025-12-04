+++
title = "Pathological PATH"
date = 2025-11-24
description = "A deep dive into shells and their default PATH"
[taxonomies]
tags=["osh", "linux"]
+++

Sometimes it's your CI server, sometimes it's cross compilation, and sometimes someone on a Mac just wants to build your code. Even in the wild west of the early 80s, you still REALLY wanted to be able to run the code you [painstakingly typed out by hand from BYTE magazine](https://archive.org/details/byte-magazine-1980-07/page/n43/mode/2up). Compatibility has always been important.

I've been helping improve the compatibility of [osh](https://oils.pub/osh.html) as part of the [oils project](https://oils.pub/), but ran into this weird inconsistency between shells regarding `PATH` in an empty environment.

It reminded me how `PATH` can be the ultimate compatibility ruiner. If you haven't had the displeasure of trying to figure out why you couldn't run a newly installed version of some program or library, then you've surely fought with one of `PATH`'s close relatives, [`PYTHONPATH`](https://stackoverflow.com/questions/1899436/pylint-unable-to-import-error-how-to-set-pythonpath) or [`JAVA_HOME`](https://stackoverflow.com/questions/21964709/how-to-set-or-change-the-default-java-jdk-version-on-macos/24657630#24657630).

But if `PATH` is truly so important for compatibility, why can't different shells agree on this small example?

<pre><code>$ env -i /bin/mksh -c <string>'echo $PATH'</string>
<comment>/bin:/usr/bin</comment>

$ env -i /bin/zsh -c <string>'echo $PATH'</string>
<comment>/bin:/usr/bin:/usr/ucb:/usr/local/bin</comment>

$ env -i /bin/ash -c <string>'echo $PATH'</string>
<comment>/sbin:/usr/sbin:/bin:/usr/bin</comment>

$ env -i /bin/bash -c <string>'echo $PATH'</string>
<comment>/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/bin:/sbin:.</comment>

$ env -i /bin/sh -c <string>'echo $PATH'</string>
<comment>/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin</comment>
</code></pre>

What's going on above is

- `env -i` → Clears the environment. All environment variables, including `PATH`, get removed.
- `<shell> -c` → Evaluates the following string in a non-interactive shell. This is the same mode as when you run a shell script.
- `'echo $PATH'` → You'd expect this to be empty because `PATH` is an environment variable and it just got cleared. But `PATH` is so important that shells have a built-in default included in their source code!

I'm getting a little ahead of myself. Let's start from the beginning of the story.

<div style="text-align: center; margin-bottom: 16px;">
    <div style="margin: auto; display: inline-block; text-align: left;">
        <a href="#a-pivotal-path">A. Pivotal <code>PATH</code></a>
        <br>
        <a href="#b-where-do-my-binaries-live">B. Where do my binaries live?</a>
        <br>
        <a href="#c-where-do-paths-come-from">C. Where do <code>PATH</code>s come from?</a>
        <br>
        <a href="#d-nobody-uses-anything-but-bash-anyways">D. Nobody uses anything but <code>bash</code> anyways</a>
        <br>
        <a href="#e-this-matters-in-the-real-world">E. This matters in the real world!</a>
        <br>
    </div>
</div>

## A. Pivotal `PATH`

Your shell uses [`PATH`](https://en.wikipedia.org/wiki/PATH_(variable)) to find the right binary when you run a command. Running commands is important.<sup><a href="https://www.explainxkcd.com/wiki/index.php/285:_Wikipedian_Protester">[citation needed]</a></sup> Say we wanted to run the following in `bash`:

```sh
$ gcc main.c -o main
```

Per `bash`'s [reference manual](https://www.gnu.org/software/bash/manual/bash.html#Command-Search-and-Execution-1) it would perform the following steps:

0. Check if `gcc` contains any slashes in its name → <soft-yellow>nope.</soft-yellow>
1. Check if `gcc` is a shell function → <soft-yellow>nope.</soft-yellow>
2. Check if `gcc` is a shell builtin → <soft-yellow>also nope.</soft-yellow>
3. Search each directory in `PATH` for an executable file named `gcc` → <soft-green>Aha!</soft-green> Found `/usr/bin/gcc`.
4. Execute `gcc` in a separate execution environment.

## B. Where do my binaries live?

<div class="question" style="margin-bottom: 16px;">
    <img src="/images/profiles/default3.png">
    <div>
        Why is <code>gcc</code> in <code>/usr/bin</code>? Just <code>/bin</code> sounds like it would be simpler.
    </div>
</div>

To answer this question, we're first assuming you're on a Linux system. But even then, different Linux systems vary on where they place certain binaries. Luckily, most Linux distributions make it their policy to follow FHS, or the [Filesystem Hierarchy Standard](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard), originally developed in 1994 by the Linux Foundation to unify conventions regarding key directories.

### `/bin` and `/usr/bin`

According to FHS, `/bin` is for **programs that may be used by anyone**, but which are required when no other filesystems are mounted. `/usr/bin` is just the primary directory for executable commands on the system.

On Debian `/bin` is a symlink to `/usr/bin`, which sounds like a good call.

<div class="question">
    <img src="/images/profiles/default5.png">
    <div>
        Wait... why would <code>/bin</code> and <code>/usr/bin</code> be separate directories in the first place?
    </div>
</div>
<div class="answer">
    <div>
        Good question!
    </div>
</div>
<div class="answer">
    <div>
        Back in the olden days <a href="https://ourworldindata.org/grapher/historical-cost-of-computer-memory-and-storage">drives were expensive</a> and not very large. The idea was that you could save space and money by sharing a single <code>/usr</code> drive (filled with all sorts of useful goodies) between a large number of hosts.
    </div>
</div>
<div class="answer">
    <div>
        However, if you were playing around and <a href="https://xkcd.com/456/">messed up your system</a> such that mounting <code>/usr</code> failed, you REALLY wanted all the commands needed to fix the issue on your current drive.
    </div>
</div>

### `/sbin` and `/usr/sbin`

`/usr/sbin` is for binaries **used exclusively by the system administrator**. Just like before, `/sbin` is typically a symlink to `/usr/sbin`. This directory consists of commands for configuring the system, like `adduser`, `chroot`, or `ip`.

### `/usr/local/bin` and `/usr/local/sbin`

FHS recommends placing locally installed software in `/usr/local/bin` and `/usr/local/sbin`. It notes that system updates shouldn't mess with anything under `/usr/local`. Informally, this is where software goes that wasn't installed using a package manager.

### `/usr/ucb`

An unexpected directory to be built-in to `zsh`'s default `PATH`.

FHS does not specify `/ucb` anywhere, because it's a convention on BSD! Apparently `ucb` stands for "University of California, Berkeley" where BSD originated, and the directory was **intended for compatibility with tools developed for BSD** systems. Although `/bin/ucb` seems to have been deprecated in some BSD systems [since as early as 1993](https://docs-archive.freebsd.org/44doc/smm/01.setup/paper.pdf), which may be part of the reason is doesn't appear in FHS.

### Current directory

`.` of course refers to the current directory. If `.` is in your `PATH`, then you can run any binaries in the current directory without needing to prepend `./`.

## C. Where do `PATH`s come from?

<div class="question" style="margin-bottom: 16px;">
    <img src="/images/profiles/default18.png">
    <div>
        When I do <code>echo $PATH</code> in <code>bash</code> I get a whole lot of paths, but none of them are <code>"."</code>, as above. What's going on?
    </div>
</div>

Contrary to popular belief, A stork does not fly to your Linux distro and set its `PATH` during installation. Unfortunately, there's actually a lot of nuance regarding which config scripts get run when the environment is setup. The following are only the most common examples.

### Interactive shells

When you open your terminal, this is called an interactive shell. It gives feedback when you type commands, which is helpful for human brains.

When <code>bash</code> starts up as an interactive shell it follows a <a href="https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html">startup routine</a>. It first executes <code>/etc/profile</code> which is the system wide initialization script for shells. <code>bash</code> then runs the following in order: `~/.bash_profile`, `~/.bash_login`, and finally `~/.profile`.

### Non-interactive shells

<div class="question">
    <img src="/images/profiles/default18.png">
    <div>
        I looked at <code>/etc/profile</code> and saw it assigns <code>PATH</code>, but it's different than <code>env -i /bin/bash -c 'echo $PATH'</code>.
    </div>
</div>
<div class="question" style="margin-left: calc(2.5em + 6px)">
    <div>
        Since <code>/etc/profile</code> is the first script to <code>export PATH</code>, it has to be the default <code>PATH</code>, right?
    </div>
</div>

<div class="answer">
    <div>
        Yes, <code>/etc/profile</code> is the default <code>PATH</code> for interactive shells. However, non-interactive shells don't follow the startup routine above.
    </div>
</div>

<div class="answer">
    <div>
        So what's the value of <code>PATH</code> before <code>/etc/profile</code>? That's the <b>true</b> default <code>PATH</code>. You can find it <a href="https://github.com/bminor/bash/blob/a8a1c2fac029404d3f42cd39f5a20f24b6e4fe4b/config-top.h#L61">embedded in bash's source code</a>.
    </div>
</div>

### Environment variables exist outside of shells 

<div class="question">
    <img src="/images/profiles/default18.png">
    <div>
        I started a non-interactive shell with <code>bash -c 'echo $PATH'</code> but it still doesn't show the default <code>PATH</code>. Why?
    </div>
</div>

<div class="answer">
    <div>
        <code>/etc/profile</code> exports <code>PATH</code>, which makes it an environment variable. Environment variables are <a href="https://tldp.org/LDP/tlk/kernel/processes.html#:~:text=environment%20variables">per-process</a>, typically stored <a href="https://refspecs.linuxfoundation.org/elf/x86_64-abi-0.98.pdf">near the beginning of the stack</a>, but before the first function frame.
    </div>
</div>

<div class="answer">
    <div>
        Crucially, when a child processes is <a href="https://man7.org/linux/man-pages/man2/execve.2.html">executed</a> it <a href="https://man7.org/linux/man-pages/man7/environ.7.html#:~:text=it%20inherits%20a%20copy%20of%20its%0A%20%20%20%20%20%20%20parent%27s%20environment">inherits environment variables</a> from its parent.
    </div>
</div>

<div class="question">
    <img src="/images/profiles/default18.png">
    <div>
        Then how can you get the true default <code>PATH</code>?
    </div>
</div>

<div class="answer">
    <div>
        If you really want to reset your environment, you can use <code>env -i</code>. <code>env</code> is for modifying the environment of a child process, while the <code>-i</code> (or <code>--ignore-environment</code>) starts with an empty environment.
    </div>
</div>

### `/etc/sudoers`

The sudo policy affects auditing, logging, and policy decisions. `/etc/sudoers` specifies the default sudo policy.

The most important aspect of the sudo policy, in our situation, is how it affects the [command environment](https://man7.org/linux/man-pages/man5/sudoers.5.html#:~:text=proto(5).-,Command%20environment,-Since%20environment%20variables). Notably, it can restrict which environment variables are inherited after running the `sudo` command!

By default `/etc/sudoers` appears to have `env_reset` set, with `secure_path` equal to `/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`. This means that if no `PATH` environment variable is set, whatever is run by the `sudo` command will get the value of `secure_path`. This works as follows:

<pre><code>$ env -i bash -c <string>"sudo ./echo_path.sh"</string>
<comment>/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin</comment>

<comment># modify secure_path in /etc/sudoers</comment>
$ env -i bash -c <string>"sudo ./echo_path.sh"</string>
<comment>/this:/is:/a:/modified:/secure:/path</comment>
</code></pre>

<details style="margin-bottom: 16px;">
    <summary style="cursor: pointer;">Some lame additional details about <code>/etc/sudoers</code> for those interested</summary>
    <div>
        <blockquote>
            By default, the <code>env_reset</code> flag is enabled. This causes commands to be executed with a new, minimal environment ... [which] is initialized with the contents of <code>/etc/environment</code>.
        </blockquote>
        <blockquote>
            Additional variables, such as <code>DISPLAY</code>, <code>PATH</code> and <code>TERM</code>, are preserved from the invoking user's environment if permitted by the <code>env_check</code>, or <code>env_keep</code> options.
        </blockquote>
        <blockquote>
            If the <code>PATH</code> and <code>TERM</code> variables are not preserved from the user's environment, they will be set to default values.
        </blockquote>
        <blockquote>
            If, however, the <code>env_reset</code> flag is disabled, any variables not explicitly denied by the <code>env_check</code> and <code>env_delete</code> options are allowed and their values are inherited from the invoking process.
        </blockquote>
    </div>
</details>


## D. Nobody uses anything but `bash` anyways

I have [little evidence](https://www.reddit.com/r/linux4noobs/comments/12wfzb8/best_shell_in_your_opinion_2023/), but even before diving into shells I'd see `zsh` in surprising places, often because of its ease of customization for interactive use. There is **at least** a small place in the world for [new shells](https://www.oilshell.org/blog/2021/01/why-a-new-shell.html)!

One such shell is `osh`. Its goal is to move on from `bash`. Sure, `bash` has always been there for us, [but](https://news.ycombinator.com/item?id=35992575) [it's](https://wizardzines.com/zines/bite-size-bash/#:~:text=Variable%20assignment%20is%20weird) [time](https://wizardzines.com/zines/bite-size-bash/#:~:text=if%20statements%20run%20programs%20instead%20of%20checking%20a%20boolean%20value).

`osh`'s key contribution is a 3-stage [upgrade path](https://oils.pub/osh.html) that makes transitioning from `bash` to a better tool as easy as possible:

1. **Transparency**. Replace `bash` with `osh` and don't notice anything.

    `bash` is the default shell language on most Linux systems, and the one that most shells scripts target. If `osh` hopes to be easy to adopt, compatibility with `bash` is crucial!

2. **Error Checking**. Opt into a bunch of [helpful error checks](https://oils.pub/release/latest/doc/error-catalog.html#OILS-ERR-301) by enabling strict mode `shopt --set strict:all`.

3. **New Paradigm**. Upgrade to `ysh`, a modern shell language that shares most of its runtime with `osh`, with `shopt --set ysh:upgrade`.

## E. This matters in the real world!

I've recently been helping with a ["secret project"](https://oils.pub/blog/2025/09/releases.html#:~:text=of%20work%20on-,regtest/aports,-%2C%20a%20batch%20job) to make `osh` more `bash` compatible.

### The (not so) secret project

<div style="margin-top: 16px;"></div>

0. Spin up an alpine linux instance.
1. Replace `/bin/bash`, `/bin/sh`, and `/bin/ash` with [symlinks](https://en.wikipedia.org/wiki/Symbolic_link) to `osh`.
2. Try to build a specific package, like `nginx`.
3. If it fails, deduce which shell script caused the bug and fix it.
4. Repeat for every package from the [alpine linux package index](https://pkgs.alpinelinux.org/packages).

This is a cool idea because if someone using alpine linux ([like me](https://ish.app/)) happened to sneeze and `ash` (alpine's default shell) got replaced with `osh`, they almost wouldn't notice. Commands, package builds, and scripts would all work the same as before!

Given the alpine package manager's wide usage, such a detailed suite of automated tests approximately enumerates all observable shell behaviour. So according to [Hyrum's Law](https://www.hyrumslaw.com/), `osh` and `ash` would be approximately indistinguishable! However, `ash`, and `bash` are incompatible shells themselves, so it's a dream that could never be. At least these tests help `osh` find a lot of `bash` incompatibilities along the way.

### Default `PATH` matters

My role in this project has been to dig into packages that fail to build, then find their **root cause**.

For example, when you try to build the `lua-aports` package, [a bunch of tests fail](https://web.archive.org/web/20251114091059/https://op.oils.pub/aports-build/2025-10-22.wwz/_tmp/aports-report/2025-10-22/disagree-2025-10-15-main/osh-as-sh/log/lua-aports.log.txt). It's not clear to me what `lua-aports` does exactly, but Lua is definitely involved. One failing test is the following:

<pre><code>[ RUN      ] spec/abuild_spec.lua:36: abuild get_conf should return the value of a configuration variable from the user config
Unable to deduce build architecture. Install apk-tools, or set CBUILD.
spec/abuild_spec.lua:37: Expected objects to be equal.
Passed in:
(string) <string>''</string>
Expected:
(string) <string>'myvalue'</string>

stack traceback:
	spec/abuild_spec.lua:37: in function &lt;spec/abuild_spec.lua:36&gt;
</code></pre>

<!-- TODO: clean up formatting past here -->

Of course, this doesn't seem to be related to the default `PATH` at all, but debugging can be tricky like that. If you're interested in the (slightly compressed) trail I followed, it was:

0. `MYVAR` doesn't exist in the current environment? Something must be up. 

    <pre><code>describe(<string>"get_conf"</string>, function()<br>    local abuild = require(<string>"aports.abuild"</string>)<br>    it(<string>"should return the value of a configuration variable from the user config"</string>, function()<br>        <comment>-- This assertion is failing!</comment><br>        assert.equal(<string>"myvalue"</string>, abuild.get_conf(<string>"MYVAR"</string>))<br>    end)<br>end)</code></pre>

1. This Lua test is part of a test framework called `lua-busted`, which is invoked after the package builds using the command `env -i busted-$(LUA_VERSION) --verbose`. `busted-5.4` (our current version) starts with a shebang, so the error might occur before the testsuite is run?

    <pre><code><comment>#!/usr/bin/lua5.4</comment><br><comment>-- Busted command-line runner</comment><br>require <string>'busted.runner'</string>({ standalone = <const>false</const> })</code></pre>

2. Oh wow, just running `./busted-5.4` without `env -i` passes all tests. Something in the environment must be causing these issues.

3. There are a few key differences between the environment variables of `ash` and `osh` (only differences shown):

    <pre><code>$ cat ./display_env.sh<br><comment>env</comment><br><br>ash$ env -i ./display_env.sh<br><comment>PATH=/sbin:/usr/sbin:/bin:/usr/bin</comment><br><comment>SHLVL=1</comment><br><br>osh-0.36$ env -i ./display_env.sh<br><comment>PATH=/bin:/usr/bin</comment><br><comment>LINES=63</comment><br><comment>COLUMNS=141</comment></code></pre>

4. Aha! Adding `/sbin:/usr/sbin` to `osh`'s default `PATH` solves the build failures. The testing framework must have depended on a non-interactive subshell that tried to run system configuration commands, likely for the local environment.

Now we reach the end of our story where the [pathological case](https://en.wikipedia.org/wiki/Corner_case)... was the shell's default `PATH`.