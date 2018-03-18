---
title: Docker Sucks
published: true
---

I just want to put it out there that docker is a VERY buggy product, even after so many years. The number of filesystem related bugs (deadlocks, improper disk space cleanup, improper inode usage) is enormous. Just go to the github docker issues page and look at it. ["no space left on device" search in issues](https://github.com/moby/moby/issues?utf8=%E2%9C%93&q=is%3Aissue+no+space+left+on+device+). There are so many old issues that were never resolved. These issues arise the most in environments where the containers are created and removed frequently (like CI).

When such things happen, the only way to fix it is a docker daemon reboot (and sometimes having to manually remove `/var/lib/docker`).

I know that they don't owe me anything, but I am very frustated with it after years of usage.