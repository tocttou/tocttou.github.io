---
title: ./gsoc init
published: true
---

GSoC 2016 results are out now and I have been selected to work with [CloudCV](https://cloudcv.org/) this summer. The idea that I'll be working on is 'CloudCV-fy your code' (not the final name of course). This involves creating a system where anyone can upload their model and train-validate-evaluate on CloudCV's infrastructure themselves and/or make it available for others to evaluate. As straightforward as it may sound, it does require meticulous planning. The coding period begins next month. Till then I have a lot to read up on.

There were some toy tasks given by CloudCV to filter the candidates. I chose toy task 2, which was to create a pipeline builder for OpenCV. At first I tried to implement the mockup given in task statement as it is and made this:

![Linked List implementation - CloudCV Toy Task 2](https://i.imgur.com/Ll0TORp.png)

But then upon discussion with mentor [Harsh Agrawal](https://github.com/dexter1691), I decided to implement it as a graph instead. Linked list was what others were doing anyway. This helped me make my proposal stand out from the rest. The end result was this:

<video width="100%" height="380px" autoplay loop>
  <source src="https://zippy.gfycat.com/MealyEnchantingBedlingtonterrier.webm" type="video/webm">
  Your browser does not support HTML5 video.
</video>

Detailed demo on how the pipeline is constructed:

<iframe width="100%" height="380px" src="https://www.youtube.com/embed/Y30LX8YrgRY" frameborder="0" allowfullscreen></iframe>
<br>

I have taken down the live version of this toy task since then. The code is available for anyone to see/run on [Github](https://github.com/tocttou/djtest). To see the backend implementation of this webapp, head over straight to [views.py file](https://github.com/tocttou/djtest/blob/master/main/views.py).

Thanks to [Abhishek Das](https://twitter.com/abhshkdz) and [Amanpreet Singh](https://twitter.com/apsdehal) for proofreading my proposals.

Can't wait to punch out sweet sweet code!

___

I applied to one other organization, Chapel as well. The task there was to build an online IDE for the Chapel language. I made a functional demo for it. Here is what that little IDE looked like:

![My Own Web IDE](/images/posts/try_java.png)

___
