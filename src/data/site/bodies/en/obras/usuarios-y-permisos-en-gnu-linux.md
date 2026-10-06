<br><br><br><br><br>This is something that many new users find confusing...<br><br>Many times they will see manuals and messages that look like this:<br><br>

<div>

Code:

</div>

<div>

```
$ls todo

#apt-get install miprograma
```

</div>

<br><br>And they don't take into account the first character.<br><br>Linux<br>is a pretty secure system because most things are done in<br>user mode, so what we do in this mode will never damage<br>the system (unless we have done very stupid things before,<br>such as changing permissions on important files and<br>directories).<br><br>When in a manual or instruction we indicate that<br>a command should be used in user mode, we use the character "\$" at the<br>beginning of the line, for example:<br><br>

<div>

Code:

</div>

<div>

```
$mkdir nuevacarpeta
$rm archivodeprueva
$ls *
```

</div>

<br>In contrast, when we need to run a command as administrator, we indicate it with the character "#", for example:<br><br>

<div>

Code:

</div>

<div>

```
#apt-get install loquesea
#nano /etc/archivo.conf
#rm -r /*
```

</div>

**Recommendations:**<br><br>For<br>the safety of their equipment, when they go to run a command as<br>administrator, start the session, execute what they need to execute,<br>and return immediately to user mode, this will save them from making an<br>error that could be fatal to the system.<br><br>**Switching between user mode and Administrator:**<br><br>In Linux there will always be more than one way to do things.<br><br>The<br>most common option to run a command is to open a virtual console (some<br>program within the graphical environment that shows us the command line in<br>the purest MS-DOS style). and execute commands. When opening it, we will<br>see something like:<br><br>

<div>

Code:

</div>

<div>

```
paynalton@Carlos-Internet:~$
```

</div>

As<br>you can see, the "\$" indicates that we are in user mode. To be more<br>specific, the PROMPT is structured as follows:<br><br>

<div>

Code:

</div>

<div>

```
paynalton                  @       Carlos-Internet      :   ~                       $
NombreDelUsuario     @       NombreDelEquipo  :   DirectorioActual   MODO
```

</div>

To switch to administrator mode we use the command "su"<br><br>

<div>

Code:

</div>

<div>

```
paynalton@intraasm:~$ su
Password:
intraasm:/var/www/nuevaintra#
```

</div>

<br>As<br>ven changes the final character to a "#" indicating that we are in<br>administrator mode, to return to the previous mode simply use the<br>command "exit"<br><br>

<div>

Code:

</div>

<div>

```
paynalton@intraasm:~$ su
Password:
intraasm:/var/www/nuevaintra# exit
exit
paynalton@intraasm:~$    
```

</div>

<br>Thus, you will always return to the previous user.<br><br>Some<br>systems, for security reasons, do not allow you to use the "su" command (Ubuntu<br>and all its derivatives), but instead come with another quite useful and secure<br>command: "sudo" (stand in for superuser). This command will allow you to<br>execute commands as if you were the administrator, but without fully opening the<br>session, so that you do not need to use the "exit" command.<br><br>Therefore, if in a manual you see something like:<br>

<div>

Code:

</div>

<div>

```
$./config
$./make
#./make install
```

</div>

<br>it is the same as if you execute:<br><br><br>

<div>

Code:

</div>

<div>

```
paynalton@intraasm:~$./config
paynalton@intraasm:~$./make
paynalton@intraasm:~$su
Password:
intraasm:/var/www/nuevaintra#./make install
intraasm:/var/www/nuevaintra# exit
exit
paynalton@intraasm:~$  
```

</div>

 <br><br>and<br><br>

<div>

Code:

</div>

<div>

```
paynalton@Carlos-Internet:~$./config
paynalton@Carlos-Internet:~$./make
paynalton@Carlos-Internet:~$ sudo ./make install
[sudo] password for paynalton:
paynalton@Carlos-Internet:~$
```

</div>

<br><br>And I think that's all for this brief clarification, I hope it is useful to you.<br><br>If you wish to know more about the commands mentioned here, do not forget to check the manuals by typing in your console:<br>

<div>

Code:

</div>

<div>

```
$man comando
```

</div>

<br>
