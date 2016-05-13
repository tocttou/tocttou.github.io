---
title: ./gsoc init
published: true
---

GSoC 2016 results are out now and I have been selected to work with [CloudCV](https://cloudcv.org/) this summer. The idea that I'll be working on is 'CloudCV-fy your code' (not the final name of course). This involves creating a system where anyone can upload their model and train-validate-evaluate on CloudCV's infrastructure themselves and/or make it available for others to evaluate. As straightforward as it may sound, it does require meticulous planning. The coding period begins next month. Till then I have a lot to read up on, so that the execution is perfect.

There were some toy tasks given by CloudCV to filter the candidates. I chose toy task 2, which was to create a pipeline builder for OpenCV. At first I tried to implement the mockup given in task statement as it is and made this:

<a href="https://i.imgur.com/Ll0TORp.png" data-lightbox="linked-cloudcv" data-title="Linked List implementation - CloudCV Toy Task 2">![Linked List implementation - CloudCV Toy Task 2](https://i.imgur.com/Ll0TORp.png)</a>

But then upon discussion with mentor [Harsh Agrawal](https://github.com/dexter1691), I decided to implement it as a graph instead. Linked list was what others were doing anyway. This helped me make my proposal stand out from the rest. The end result was this:

<video width="100%" height="380px" autoplay loop>
  <source src="https://zippy.gfycat.com/MealyEnchantingBedlingtonterrier.webm" type="video/webm">
  Your browser does not support HTML5 video.
</video>

Detailed demo on how the pipeline is constructed:

<iframe width="100%" height="380px" src="https://www.youtube.com/embed/Y30LX8YrgRY" frameborder="0" allowfullscreen></iframe>
<br>

I have taken down the live version of this toy task since then. The code is available for anyone to see/run on [Github](https://github.com/tocttou/djtest). To see the backend implementation of this webapp, head over straight to [views.py file](https://github.com/tocttou/djtest/blob/master/main/views.py).

One funny thing here is that I was interested in task 1 (CloudCV-fy your code) from day 1 but I did toy task 2, which was the precursor to task 2 because I knew I would shine there. So as it follows up, initially I wrote the proposal for idea 2. Specifically my idea was to implement a pipeline builder in browser for Keras with both Tensorflow and Theano backend support. I did manage to write a *decent enough* proposal but it was no where up to the mark. I wanted to do task 1 and not this. So I decided to write a proposal for task 1 instead and looks like it turned out well! Thanks to [Abhishek Das](https://twitter.com/abhshkdz) and [Amanpreet Singh](https://twitter.com/apsdehal) for proofreading my proposals.

Projects like these make me love software even more. Can't wait to punch some sweet code!

___

One more thing that I must mention is that I applied to one other organization, Chapel as well. The task there was to build an online IDE for the Chapel language. I made a functional demo for it and implemented most of what was asked in the task within a week :p For the proposal I expanded the scope of the project a lot by focusing on their 'outreach' program. Then I modified that demo IDE to run many other languages, namely C, CPP, Java, Javascript (nodejs), Python2 and Python3. This new modified version won 2nd prize in Dynamic Applications category in Srishti 2016, our hobbies club's annual exhibition. Here is what that little IDE looked like:

<a href="/images/posts/try_java.png" data-lightbox="try-java" data-title="My own Web IDE">![My own Web IDE](/images/posts/try_java.png)</a>

I wanted to build something like this for a long time. This online IDE is complete with proper syntax highlighting & linting for the listed languages, getting a permalink to your code, stdin support, streaming stdout and stderr directly from your program to the pseudo-terminal on the right side over websockets and most imporantly it has configurable resource constraints to prevent any type of harmful code from doing damage to the application or hog resources. I intend to work on this little IDE of mine as a side project and will release it in the coming months as a full fledged project. I have taken down the live version for this as well. I have a roadmap ready for this. No code for now but expect something soon!

___

I will blog about my progress with GSoC frequently. Stay tuned for more!