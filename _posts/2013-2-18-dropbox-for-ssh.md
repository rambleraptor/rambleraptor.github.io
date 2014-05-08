---
layout: post
title: Dropbox for SSH
date: February 18, 2013
---


At the university level, a serious problem occurs when you want to code on your computer: you have to compile it elsewhere. The official university complier might be newer, older, or you just want to be super safe. So what do you do? You could either:
	- Use a flash drive (so low tech)
	- Not code on your laptop (not gonna happen)
	- Treat your University File System as a Local Drive

Enter sshfs. You can mount any remote file system over ssh and then treat it as if it were a separate hard drive. Think Dropbox for anything. So how does one set it up?
First:
{% highlight bash %}
brew install sshfs
{% endhighlight  %}

On a Mac, that'll get you installed. Not using Homebrew? Fix that.

Next comes the incredibly lengthy command. I'm gonna break it up into parts:
{% highlight bash %}
sshfs hostname:location_on_host mount_point
{% endhighlight  %}

One step at a time.
Hostname: This is what you're ssh'ing into. Think username@server.

Location_on_host: What folder do you want to access? This is the path to that directory. Find the directory you want to access remotely and grab the pwd.

mount_point: You need a folder on your machine to act as a mirror. Nothing will be placed into this folder. But, when sshfs is going, this mount_point folder is going to be your portal into the remote folder. That means that the remote folder /Users/test/test2 becomes mount_point on your local machine. Whatever you do on mount_point happens to /Users/test/test2

That's it. Check mount_point and you'll see your remote folder.

All done? Don't forget to unmount it.
{% highlight bash %}
umount mount_point
{% endhighlight  %}

Enjoy.
