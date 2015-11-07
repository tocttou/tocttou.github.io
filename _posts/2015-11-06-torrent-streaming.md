---
title: Making my own torrent streaming service
---

Few weeks back Microsoft came to my college for the annual [Code.Fun.Do](https://www.acadaccelerator.com/Home/Events) hackathon. I was planning to make an app that extracted text from photographs taken by the phone camera and then does *something*. The idea had a lot of potential but initial tests were not very successful, primarily because text extraction was messed up nearly 8/10 times. It was clear that a lot more training and traindata was required for this to work and that demanded time but there was dearth of it and even more considering that mine was a one man team. So I decided to make an app that can be used to watch movies from torrents on mobile phone.

Microsoft guys were very excited to see it work but apparently they couldn't support such *illegal activities*, and fairly so.

**Note:** Since the [MAFIAA](http://mafiaa.org/) (quite literally) recently shut down YTS API which I was using for this app, you'll have to use some other service like [this one](https://getstrike.net/api/) for aggregating torrents and [this one](https://www.themoviedb.org/documentation/api?language=en) for displaying the movie data. I won't publish the code for this app since it is obsolete now.

<hr>

## Lets get started (no code)

### Step1: Deciding the functionality

1. The app should present movies in a Netflix/PopcornTime -ish interface.
2. Tapping on the movie tile should bring up its page and display the relevant metadata.
3. From there we should be able to watch the movie.

### Step2: Deciding the technology stack

1. The mobile app is built using [Apache Corodova](https://cordova.apache.org/).
2. For styling I used [Bootstrap3](http://getbootstrap.com/), app logic is written in vanilla JS. Alternatively, [Ionic](http://ionicframework.com/) is a very good choice for styling and writing app logic using AngularJS.
3. An intermediary API is setup on a DigitalOcean server using the [Bottle Microframework](http://bottlepy.org/docs/dev/tutorial.html) in python. Make sure that you enable [CORS](http://bottlepy.org/docs/dev/recipes.html#using-the-hooks-plugin) because the app uses AJAX calls.
4. Torrenting is blocked by my ISP so [transmission-daemon](http://www.transmissionbt.com/) should run on the DO server to handle the requests related to torrents.
5. Nodejs is used to stream the movie. [vid-streamer](https://github.com/meloncholy/vid-streamer) is a good choice for that as it handles a lot of other stuff like using correct MIME types and [psuedo-streaming](http://1stdev.com/tremendum-transcoder/articles/seeking-videos-beyond-the-buffer-line/#html5_pseudo-streaming) as well.

### Step3: Implementing the program flow

1. The app interacts directly with the [YTS API](https://yts.to/) (now defunct, see Note above) to fetch the latest movies filtered by ratings > 6 and sorted by date in descending order. The API responds with movies and some corresponding metadata like cover image which is used to display movies in tiles in a vertical layout.
2. Tapping any movie tile takes us to the dedicated page where the expanded metadata is nicely presented and a `Preload Torrent` button is present. Tapping it takes us to the downloads page where current 'preloads' are listed and sends the torrent file link to python server. The python server now talks to the transmission-daemon and delivers it the torrent using [transmission-rpc](https://trac.transmissionbt.com/browser/branches/1.7x/doc/rpc-spec.txt). For that I used [this python wrapper](https://pythonhosted.org/transmissionrpc/reference/transmissionrpc.html) which has a very good documentation.
3. Transmission-daemon downloads the torrent to a pre-designated directory based on the UUID of the device (there is a [Corodova plugin](https://cordova.apache.org/docs/en/2.5.0/cordova/device/device.uuid.html) to use that) which is also sent with each request to the python server to identify the user. This UUID is mapped to a userID in a sqlite3 database.
4. The downloads page displays a progress bar which can be updated by tapping the 'Check Status' button which sends a request to python server which in turn talks to transmission-daemon for torrent status and returns the result in json format to the mobile app. Pressing the Home button takes us back to the main page.
5. The vid-streamer configuration takes the directory input that houses the media files to stream. So if `file.mp4` is present in `mydir/userID/movieName` and vid-streamer is running at `$serverIP:8000` and monitoring `mydir`, the url `$serverIP:8000/userID/movieName/file.mp4` will correspond to the movie file.
6. Tapping the movie name on downloads page sends a request to the python server to check if the movie preload is complete. If yes, the server returns the streaming URL which is then embedded in a `<video>` tag on the app and video streaming starts!

**Note:** While its worth noting that pre-loading the movie on the DigitalOcean server takes only 3-4 minutes (and is recommended if the app is used by a small group or for personal use), there is another way to stream the movie i.e. directly from the torrent (which can be erratic at times). For that you can make a nodejs server and use [peerflix](https://github.com/mafintosh/peerflix) to stream your torrent directly. Alternatively, you can use bare metal [torrent-stream](https://github.com/mafintosh/torrent-stream). Be careful with the MIME types though. Or if you are feeling extra adventurous write your own implementation of the Bittorent protocol.


### Step4: Profit

Going through the procedure produced this app:

<iframe width="100%" height="380px" src="https://www.youtube.com/embed/4CsRu8g1sz0" frameborder="0" allowfullscreen></iframe>
<br>