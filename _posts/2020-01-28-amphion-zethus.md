---
title: Robotics in the browser! - Zethus + Amphion
published: true
---

The browser is perhaps the most versatile and approachable platform that has ever existed. Marrying it to robotics makes sense. For the last few months at work, I have been working in this direction with two open-source projects [Zethus]([https://github.com/rapyuta-robotics/zethus/) and [Amphion](https://github.com/rapyuta-robotics/amphion/).

**Amphion** - A library that ingests [ROS messages]([http://wiki.ros.org/msg](http://wiki.ros.org/msg)) and outputs `THREE.js` objects to visualise them. It can either subscribe to data sources and update in real-time, or updates can be dispatched manually.
**Zethus** - A library (can work as a standalone webapp as well!) that uses `Amphion` underneath to provide ready-to-go react components. In the standalone mode, it is a directly replacement of industry standard [Rviz]([http://wiki.ros.org/rviz](http://wiki.ros.org/rviz)) (but in the browser). It also enables the user to tweak parameters for `Amphion` in real-time.

The diagram below explains the flow of information in this scheme:

![amphion-zethus-process-diagram](https://i.imgur.com/ml8RnuK.png)

Currently `Amphion` reads the data from ros topics over a websocket connection using `roslibjs`. A [pull request](https://github.com/rapyuta-robotics/amphion/pull/81) is in review that enables `Amphion` to read from a generic `DataSource` stream (like from a pre-recorded rosbag).

The following sections detail some of the most interesting aspects of my work in these two projects.

### Amphion.Image

Ingests: [sensor_msgs/Image](http://docs.ros.org/melodic/api/sensor_msgs/html/msg/Image.html)
Outputs: HTML div container for the image constructed from the message. It supports multiple image encodings.

![Amphion.Image](https://i.imgur.com/8qQrmjL.png)

`Amphion.ImageStream` supports ingesting an image stream from the [ros web_video_server](http://wiki.ros.org/web_video_server) if that is preferred instead of raw messages.

### Amphion.RobotModel

Ingests: robot description ros param, package list
Outputs: a robot model that follows TF messages (messages defining the relationship between different frame of references)

![Amphion.Robotmodel](https://i.imgur.com/EVS7w7j.png)

### Amphion.InteractiveMarkers

Ingests: [visualization_msgs/InteractiveMarker](http://docs.ros.org/melodic/api/visualization_msgs/html/msg/InteractiveMarker.html)
Outputs: Makes the scene interactive by adding 6-DOF controls to certain objects in the scene. This is a near complete client implementation for ros interactive marker server (enabled by [tocttou/three-freeform-controls](https://ashishchaudhary.in/three-freeform-controls/)).

![Amphion.InteractiveMarkers](https://i.imgur.com/vhN10f7.png)

Combining `Amphion.RobotModel`, `Amphion.InteractiveMarkers` (with appropriate backend), it is possible to create complex scenes. Given below is this combination running in the browser as compared to `Rviz` working with the same backend.

![IK](https://i.imgur.com/sJTXnB3.gif)

### Amphion.Map

Ingests: [nav_msgs/OccupancyGrid](http://docs.ros.org/melodic/api/nav_msgs/html/msg/OccupancyGrid.html)
Outputs: The occupancy grid visualised as a `THREE.js` object.

![Amphion.Map](https://i.imgur.com/P5rYxGn.png)

### Amphion.Pointcloud

Ingests: [sensor_msgs/PointCloud2](http://docs.ros.org/melodic/api/sensor_msgs/html/msg/PointCloud2.html)
Outputs: `THREE.js` object that visualises the point cloud in real-time. Since the amount of data processed is often huge, `Amphion` uses webassembly to process the messages as fast as possible. 

Given below is a streaming pointcloud at ~30k points (published at `10Hz` frequency) with `x`, `y`, `z`, and `intensity` channels - (55 FPS on a measly Thinkpad L470).

![Amphion.Pointcloud](https://i.imgur.com/9cs4jYU.gif)

The full video can be viewed [here](https://youtu.be/XIDbjNOjETE).

### Multiple visualisations in the same scene

The scene below has the following visualisations working at the same time:

1. `Amphion.Laserscan`
2. `Amphion.MarkerArray`
3. `Amphion.Pointcloud`
4. `Amphion.Range`
5. `Amphion.RobotModel`

![Multiple visualisations](https://i.imgur.com/LCErG1o.png)

### Other visualisations

A list of all supported visualisations is available [here](https://github.com/rapyuta-robotics/amphion/wiki/viz).

### Zethus Configurations

Different visualisations have different options attached to them. The sidebar in `Zethus` can be used to tweak these options. A set of default options like (grid size, background colour, global frame of reference) are also available.

![zethus configurations](https://i.imgur.com/GakEvcq.png)

### Zethus Publishers

`Zethus` also has a set of publishing tools that are helpful in debugging the scene.

The following tools are available:

![zethus publishers tools](https://i.imgur.com/VMFlDko.png)

1. `Controls`: enables rotating/translating/zooming in the scene (default)
2. `Pose Estimate`: useful for estimating the pose (position and orientation) of an arrow drawn in the scene
3. `Nav Goal`: useful for sending a target pose on a ros topic using an arrow drawn in the scene
4. `Point`: useful for finding out the position of a point present on a visualisation

Given below is a demo of what the `Pose Estimate` tool looks like (the yellow arrow is bound to the mouse):

![zethus pose estimate](https://i.imgur.com/0UmlMnK.png)

### Zethus Info Panel

Sometimes it is necessary to read the raw messages in addition to the visualisations. For this purpose `Zethus` includes an info panel component that can filter on specific keys in the messages.

Given below is the `Amphion.Image` visualisation along with an info panel listening on the same ros topic.

![zethus info panel](https://i.imgur.com/7W4XgVe.png)

I won't list all the features in this post. Go check out the [project]([https://github.com/rapyuta-robotics/zethus](https://github.com/rapyuta-robotics/zethus))!
