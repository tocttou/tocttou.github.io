---
title: 'Announcing three-freeform-controls'
published: true
---

For the last few months I have been working (on/off) on a controls library for `THREE.js` objects. Finally got the time to finish the docs and api reference.

It provides 6-dof rotation and translation controls and is built to be fully customisable (something that I found to be lacking in TransformControls).

Documentation: [https://ashishchaudhary.in/three-freeform-controls/](https://ashishchaudhary.in/three-freeform-controls/)

Github: [https://github.com/tocttou/three-freeform-controls](https://github.com/tocttou/three-freeform-controls)

Examples: [https://ashishchaudhary.in/three-freeform-controls/docs/examples](https://ashishchaudhary.in/three-freeform-controls/docs/examples.html)

![three-freeform-controls](https://i.imgur.com/cTJTG9o.png)

The following features are currently implemented:

 1. translation controls with 3 degrees of freedom
 2. rotation controls with 3 degrees of freedom
 3. translation and rotation controls about axes at arbitrary axes
 4. plane controls for translation restricted to an arbitrary plane
 5. rotation controls in the eye plane
 6. free-pick controls for translation in the eye plane
 7. fixed mode controls (retain orientation wrt. object rotation)
 8. inherit mode controls (make controls follow object rotation)
 9. custom objects as controls handles
 10. enabling partial controls only
 11. multiple instances of controls anchored to a single object
 12. different instances of controls anchored to a different objects

The following two tasks are next on the radar:

1. snap to grid in Translation controls
2. tests

Excited to take the project forawrd!