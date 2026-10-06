<br><br><br><br><br>One of the main problems with GNU/Linux since its inception<br>has always been standardization. And it's that GNU/Linux has<br>always been an open project for everyone, where thousands of hands<br>have created a small piece of code. But, after all, humans are<br>not always going to agree, and with so many hands involved, it's<br>difficult to have order, since each person can have a Linux completely<br>different from what their neighbor has.<br><br>Then application<br>developers have a big problem: When they create their<br>program, they use different libraries to save work and<br>check that it works correctly on their system. But if the developer<br>wants to distribute it, it's very likely that<br>other computers don't have the same libraries that they used or<br>simply that they are in a different directory than expected,<br>which makes their program incompatible with other systems.<br><br>This<br>creates a major problem that was initially attempted to be<br>solved through LSB (Linux Standard Base), which proposed<br>a set of standard libraries that programmers could rely<br>on to always find in any Linux system.<br><br>However, this plan<br>did not progress as expected, and LSB became a solution that was not<br>well accepted, as there were serious discussions about which library<br>was better than another, a program that caused instability with<br>another, or that was too unsafe, and it ended with the breaking of relations<br>with some important companies.<br><br>And until a few years<br>ago, installing a program on Linux was a nightmare, because<br>to have it you had to find and install every single program<br>required to make that program work.<br><br>A first<br>solution was the installation packages. A user who wanted to install<br>a program had to look for the respective installation package (.deb,<br>.ebuild, .rpm, etc.) for their system, and the installer system<br>checked the program's dependencies, warning if any were missing and<br>sometimes suggesting where to download the missing program.<br><br>Later, some<br>of these installation systems could download the installation<br>packages for the missing programs (dependencies) to make<br>the user's life much easier.<br><br>All of this has evolved until reaching the current repository systems.<br><br>**REPOSITORY SYSTEMS**<br><br>Almost any version of GNU-Linux comes with a repository system. But what the hell is that?<br><br>Users<br>who migrate from one system to another are surprised to find that<br>they no longer have to spend hours searching the internet for<br>a program to install, but instead find a list of programs to install<br>within their Linux system.<br><br>A repository is that, a list of<br>programs that is maintained by the large number of users<br>and developers of a particular distribution. Every time a new program<br>or a new version of it appears, a group of enthusiasts reviews<br>the dependencies of that program, installs them, and checks<br>their stability, security, and various conflicts with other<br>applications. After a period of testing, the program is placed<br>in the list of "stable programs" where regular users can use it<br>with full confidence.<br><br>therefore a user who wants to install a program just needs to do the following:<br><br>Recognize<br>the installer system being used; for Red Hat and Fedora, YUM is used,<br>for those coming from Debian, APT is used, for Gentoo it's PORTAGE,<br>and sorry if by ignorance I omitted any.<br><br>Then they should update the list of programs from the distribution's site by running a simple command:<br>

<div>

Code:

</div>

<div>

```
#apt-get update
#emerge --sync
```

</div>

<br>Once this is done, they perform a search to find their program.<br><br>

<div>

Code:

</div>

<div>

```
$apt-cache search programa
$emerge -s programa
$yum search programa
```

</div>

<br>Once they have the exact name of the program, they simply run another command to install it:<br>

<div>

Code:

</div>

<div>

```
#apt-get install programa
#emerge programa
#yum install programa
```

</div>

<br>And that's it, the system will perform the following actions:<br><br>

- look for the latest stable version of the program<br>- calculate the number of dependencies for the<br>program - download all the necessary files to install the program and its dependencies -<br>verify that the downloaded files are not corrupted (either due to an error in the download or because someone very bad
- has altered the package) -<br>decompress all the files - install<br>all the programs - configure<br>all the programs - display options<br>for things that require the user's attention (such as accepting contracts or providing specific equipment details). And with<br>that, your program will be installed...<br><br>**Very easy, isn't it? no? why not?**<br><br>If<br>the command line isn't your thing, almost all distributions now<br>come with a graphical interface for their installer. That executes<br>those three simple commands for you, so all you have to do<br>is: find the program, select the one you want to install, and<br>click "Install"...<br><br>**Do you like danger?**<br><br>Every<br>repository system is by default set up to use stable<br>versions of the system, but if you're brave enough, you can<br>always configure it to use unstable repositories to always<br>get the latest programs straight from the forge (sourceforge),<br>and if you find any errors, don't forget to report<br>them so that, in the next update, it is fixed not only for you,<br>but for everyone who uses that program.<br><br>**I forgot, updates.**<br><br>You can<br>update your entire system, including all and every<br>one of the installed programs with a single command:<br>

<div>

Code:

</div>

<div>

```
#yum update
#apt-get upgrade
3emerge -u world
```

</div>

<br>And<br>with this you will always keep your system in the best condition and<br>obviously, there are also graphical interfaces for all of this and automatic<br>notifiers that inform you of new available updates.<br><br>Good luck, if there are any questions then it's time.<br>
