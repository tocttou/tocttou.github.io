---
title: Dockerizing a CTF
tags:
    - docker
    - Backdoor
    - SDSLabs
published: false
---

[Backdoor](https://backdoor.sdslabs.co/) is a long-lived Capture The Flag style competition run by folks at [SDSLabs](https://sdslabs.co/). For the uninitiated, in [Capture The Flag (CTF)](http://crushbeercrushcode.org/2012/10/ctfs-keeping-up-your-skills-without-going-to-jail/) style events in netsec, participants have to solve questions in various categories like cryptography, web, binary exploitations etc. Backdoor hosts CTFs from time to time having duration ranging from 6 hours to 1 day.

I started working on the process of automating challenge deployment and that culminated in restructuring the whole architecture. Lets take a look at the process.

On the basis of how challenges are presented on Backdoor, there are two broad categories:

1.  Webpage based (hereafter referred to as `public` type):
These challenges are accessible from a web browser. Example: [JUDGE](https://backdoor.sdslabs.co/challenges/JUDGE), [MEDUSA](https://backdoor.sdslabs.co/challenges/MEDUSA).
 
 2. Interactive challenges (hereafter reffered to as `script` type):
 These challenges are accessible over netcat. Example: [CLOSED](https://backdoor.sdslabs.co/challenges/CLOSED), [RAPIDFIRE](https://backdoor.sdslabs.co/challenges/RAPIDFIRE)
 
 Then there is the third type where the challenge requires both types. Example: [TEAM](https://backdoor.sdslabs.co/challenges/TEAM).

### Previous architecture:

The public type challenges were served by an Apache server running at http://hack.bckdr.in.

The script type challenges were run in chroot jails and served using the xinetd super-server. More can be learnt about this from [this post by](https://dhavalkapil.com/blogs/Combining-chroot-and-xinetd/) [@dhaval_kapil](https://twitter.com/dhaval_kapil).

### Problems with the previous architecture:

For public type challenges, the same structure has been retained. Earlier, all challenges had the same virtualHost but now each challenge has its own. This was done to better implement challenges that required custom rules or a custom domain name.

Script type challenges however had some major problems:

1. The aim is to run all script type challenges in a chroot jail but adding new environments to the jail is a huge pain in the wrong places. Try running python2 and 3 with minimal dependencies in a jail and you will know.
2. There is a big problem of redundancy. Because each challenge runs in a separte jail, each of them had their own copy of the necessary envrionment. This can be solved by creating a common jail for all challenges and that in turn solves problem no. 1 if we include the dpkg packaging system in jail so we could just apt-get install new environments but that puts all challenges at risk in case one of them gets compromised.
3. Automated monitoring of challenges' deployment status is not easy because there is no standardization.
4. Deployment takes up a lot of time. Shifting challenges from one machine to another and ensuring they work fine required a lot of manual labour given that we have 70+ challenges and many of them require an elaborate setup.


<div style="text-align: center"><blockquote class="imgur-embed-pub" lang="en" data-id="4jYSvcU"><a href="//imgur.com/4jYSvcU"></a></blockquote></div><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

