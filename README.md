# ytdl-core-muxer
An wrapper that muxes the best video and audio from ytdl-core. 
### Docs
Since youtube is splitting Video and Audio in the same time for High quality video streaming, We need [ffmpeg](https://ffmpeg.org) to join those both video and audio into single stream. All function in this package is **same** as what [ytdl-core](https://npmjs.com/package/ytdl-core) does. Just this package let's you to Download a video/audio from Youtube in High Quality. Meanwhile, The default output video format is **[matroska](https://en.wikipedia.org/wiki/matroska)**. You can change it if you want to use another output format than the default ones, By adding `outputFormat` option:
```javascript
const ytmux = require("ytdl-core-muxer");

ytmux("....", { outputFormat: "matroska" }).pipe(....);
```
