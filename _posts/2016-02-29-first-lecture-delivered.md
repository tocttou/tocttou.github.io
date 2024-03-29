---
title: First Lecture Delivered (and a small bug in gh-pages?)
published: true
---

A couple of weeks ago I delivered a hands-on lecture on python basics to freshmen in SDSLabs. This lecture was a part of the lecture series we have here to get people up and running with essential tech. This was the first time I delivered a lecture and it wasn't as hard as I was expecting it to be, more so because the audience was uninitiated (but brilliant) with python. They did ask a couple of questions which I wasn't sure of but nothing that a quick trial with the python repl couldn't answer. The lecture was a bit long so people started yawning after 4 hours (yeah right when the important bits came). It should have been in two parts. Preparing the presentation helped me consolidate what I had learned about python all through the last year.

The variant of choice here was python3. An important topic of handling exceptions was left because of the time constraint I had while preparing the slides. I _might_ add those portions in the coming days. The lecture was followed by two assignments. Here are the slides:

<div style="text-align: center;"><iframe src="assets/slides-deck.html" width="676" height="493" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>

Uggghhh... the slides.com iframe makes this page give a mixed content error because it is on http. So I have embeded the exported html file (had to manually change http resources to https). [Here is the link on slides.com](https://slides.com/ashishchaudhary/deck/).

**Edit:** This post was written on 29th February 2016 at ~ 5:00 AM IST. The post worked great locally with jekyll 3.1.2 but didn't show up on gh-pages after I pushed it to github. I faced a similar problem once when certain content that I was trying to load was on http so it didn't work. But that didn't make the build fail. Now the build is apparently failing but I am not getting any warning mail from github. Here is what I tried:

1. move all http links to https -> doesn't show up
2. remove the iframe completely -> doesn't show up
3. purge the cloudflare cache and delete the local cache as well -> doesn't show up
4. change the publication date to 28th Feb 2016 from 29th Feb 2016 -> shows up - yay!
5. add the iframe back -> shows up - yay!
6. change the date back to 29th -> doesn't show up
7. change the date back to 28th -> shows up - yay!

So did the github team forgot to account for leap years? Maybe is it a bug in [an older version of jekyll](https://pages.github.com/versions/)? I have sent the bug report to support@github. Waiting for response!

**Edit2:** Github replied. It was not a _bug_ bug. The issue was caused due to a timezone offset. Adding `future: true` to the `_config.yml` file solved the issue. More about it [here](http://jekyllrb.com/docs/upgrading/2-to-3/#all-my-posts-are-gone-whered-they-go).