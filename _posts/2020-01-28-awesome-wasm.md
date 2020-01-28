---
title: Webassembly to the rescue
published: true
---

While working on pointclouds for [Amphion and Zethus](https://ashishchaudhary.in/amphion-zethus), I came across an interesting problem.

Consider the following scenario:
1. a stream of messages containing an evolving pointcloud
2. the messages contain certain fields like `x`, `y`, `z`, `color`, `intensity` compacted (arranged sequentially) into a blob
3. the fields have their name, offset, datatype, and count given in the message
4. `offset` tells us how many bytes we need to skip in the blob to get a particular value, and `datatype` tells us how many bytes to read to get the whole value
5. endianness also must be respected while reading the values

Here is the [message definition](http://docs.ros.org/melodic/api/sensor_msgs/html/msg/PointCloud2.html).

A sample message (dummy data):

![sample ros pointcloud2 message](https://i.imgur.com/zgPeWnD.png)

After parsing the message, the data is fed into a [THREE.BufferAttribute](https://threejs.org/docs/#api/en/core/BufferAttribute) to be ingested by the GPU. But parsing the message at a high frequency is a pretty demanding task for a single thread (in the browser). For a sample pointcloud of 30k points published at 10Hz, my laptop (i7 7700HQ, GTX 1050) could only keep up 25-29 FPS when using the parser written in javascript. Comparing it to the butter smooth 60FPS using wasm for parsing is just amazing.

![Pointcloud](https://i.imgur.com/vATE8eH.png)

## So how does webassembly speed up the data processing?

To speed up the data processing pipeline, it is helpful to first visualise it:

#### Old Pipeline (JS)

![js old pipeline](https://i.imgur.com/1c8KuwP.png)

Let us examine the pipeline and find out what parts we can speed up.

Choke point `1`: It is a websocket connection. Nothing much to speed up here.

Choke point `2`: The message can sometimes be compressed. This is the point where the decompression happens and the message is put in the memory heap. We can speed up the decryption using wasm (not handled in this blog post).

Choke point `3`: The message parser reads the message and creates buffers (namely `positions`, `colors`,  and optionally `normals`) for individual fields in the message. **This is where we must introduce wasm.**

Choke point `4`: Filling the buffer attributes from the buffers created at point `4` is not an expensive task. It does not involve any copy or processing of the data.

Choke point `5`: Buffer attribute is simply fed into the GPU by `THREE.js`. Nothing much to speed up here.

#### New pipeline (wasm)

![wasm new pipeline](https://i.imgur.com/DfRILpg.png)

Unfortunately for us, webassembly cannot work on the JS memory directly. Let us examine the choke points in this new pipeline.

Choke point `1`: We must copy the data from the JS memory to the Webassembly [linear memory](https://webassembly.org/docs/semantics/#linear-memory) for the wasm parser to work on it. This is done by writing to the wasm linear memory buffer directly using `TypedArray.set`at a given offset. [Relevant code](https://github.com/rapyuta-robotics/amphion/blob/devel/src/utils/pcl.js#L166).

Choke point `2`: The parser performs its actions and creates buffers for individual fields in the message.

Choke point `3`: The field buffers are again copied back to the JS memory and the rest of the processing continues.

But this double copying negates the speed benefit wasm gives us :(

#### Can we fill the buffer attribute without copying back the field buffers from the wasm memory?

YES! All we need is the pointers of the field buffers in the wasm memory.

For creating the `position` field buffer:
```js
const positionMemPointer = pclDecoderModule.get_position_memory_ptr();
const positions = new Float32Array(
  wasmLinearMemory.buffer,
  positionMemPointer,
  3 * numberOfPositions,
);
```

If you are wondering where the `get_position_memory_ptr()` function comes from and how the field buffers are created, you can check out the [decoder module code](https://github.com/rapyuta-robotics/pcl-decoder/blob/master/src/lib.rs) (I chose rust over cpp for this because the former seems to have better wasm tooling). The code can certainly be improved (this is my first rust project).

#### New pipeline (wasm/optimised)

![wasm new pipeline optimised](https://i.imgur.com/oldCN1u.png)

By avoiding the second copy, we have optimised the message parsing.

In terms of code, the entire optimised pipeline looks like this:

```js
const wasmLinearMemory = wasmModule.memory;
const wasmLinearMemoryView = new Unit8Array(wasmLinearMemory.buffer); // No copy

// Copy data to wasm linear memory
const memoryPointer = wasmModule.get_copy_memory_ptr();
wasmLinearMemoryView.set(message.data, memoryPointer);

// Compute the field buffers (position, color)
wasmModule.compute(...message details...);

// Create view over field buffers
const positionMemPointer = wasmModule.get_position_memory_ptr();
const positions = new Float32Array(
  wasmLinearMemory,
  positionMemPointer,
  3 * numberOfPositions,
);
// Do the same for color buffer

// Update the buffer attributes
geometry.attributes['position'].updateRange = {
  offset: 0,
  count: length * 3,
};
geometry.attributes['position'].count = length;
geometry.attributes['position'].array = data;
geometry.attributes['position'].needsUpdate = true;

// Enjoy!!!!!
```

On my laptop (i7 7700HQ, GTX 1050), the new pipeline achieves butter smooth 60FPS at 30k points@10Hz. The demo video can be found below:

<iframe width="100%" height="500" src="https://www.youtube.com/embed/U_OkzZ7VmVE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
