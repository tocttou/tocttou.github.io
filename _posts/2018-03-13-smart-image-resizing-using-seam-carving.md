---
title: Smart Image Resizing Using Seam Carving
published: true
---

[Seam carving](https://people.csail.mit.edu/mrub/talks/SeamCarving_6.865.pdf) is a fascinating technique to scale up/down an image.

**Demo**

*This was a web-service.* [dead!] http://seam.ashishchaudhary.in:8080/

The code is available at: [tocttou/smartresizing](https://github.com/tocttou/smartresizing)
Overview of the application: [https://i.imgur.com/DJv24cT.png](https://i.imgur.com/DJv24cT.png)

The algorithm implementation is available directly at: [SeamCarver.kt](https://github.com/tocttou/smartresizing/blob/master/src/main/kotlin/in/ashishchaudhary/smartresizing/task/SeamCarver.kt)

**Results**

Results are fascinating (mostly).

*Reduction*

![chameleon.png](https://i.imgur.com/vfoWtCE.png)

*Expansion*

![far-field.png](https://i.imgur.com/9YDV5JU.png)

*Reduction and Expansion*

![desert.png](https://i.imgur.com/WohQC6B.png)

**Implementation**

1. Calculate `energy` for each pixel in the image based on the local color gradient (rms value of error in color between the adjacent pixels) - values can be cached but it becomes too memory intensive.
2. Add two virtual pixels, one at the top and one at the bottom of the image.
3. Construct an edge-weighted-digraph with the top virtual pixel as the source and the bottom virtual pixel as the sink. Each pixel points to the pixel directly below it and the two pixels adjacent to that pixel. The top virtual pixel points to all the pixels in the top row, and all the pixels in the bottom row point to the bottom virtual pixel.
4. We need to find the seam (path) with the low total energy, since that would be the seam that could be removed without affecting the image much. Starting from the top and coming to the bottom, we can see that the digraph is already topologically sorted and is guaranteed to be acyclic. This means that we can simply [relax](https://github.com/tocttou/smartresizing/blob/fe5ca1bd6f36d4be08204f217f2458cbeae5004a/src/main/kotlin/in/ashishchaudhary/smartresizing/task/SeamCarver.kt#L309) the edges as we come downwards using dynamic programming. Keep track of the edge in the lowest energy path connecting each pixel.
5. Trace back the edge with the lowest energy from the bottom virtual pixel up to the top virtual pixel to obtain the seam.

*Reduction*

1. Once the seam is obtained, remove it from the image.
2. Repeat this process `dimension - desiredDimension` times.

*Expansion*

1. Take a temporary copy of the original image and perform reduction on it `dimension -desiredDimension` times. Keep a track of all the consecutive seams thus obtained.
2. Since the reduction of these seams was supposed to cause the least change in the appearance of the image, addition of a seam nearby in the original image will have the same effect.
3. For each such obtained seam, add a seam adjacent to the location of that seam in the original picture. The color of an added pixel in that seam is calculated by averaging the colors of the adjacent pixels.
