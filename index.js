
/*/ //////////////////////////////////////////////////////////////////
\*\ ytdl-core-muxer: mostly copied from the ytdl-core example code :) 
\*\ credit and thanks for those authors: fent, TimeForANinja, coolaj86
/*/ //////////////////////////////////////////////////////////////////

// require all the things!
const ytdl = require('ytdl-core');
const cp = require('child_process');
const stream = require('stream');
let ffmpegPath = "ffmpeg";

// Now make sure if ffmpeg-static is installed or no. If it's no, Use default command `ffmpeg`
try {
	ffmpegPath = require("ffmpeg-static");
} catch (error) {
	ffmpegPath = "ffmpeg";
}

// default export: the ffmpeg muxer
const ytmux = (link, options = {}) => {
    let result = new stream.PassThrough({ highWaterMark: options.highWaterMark || 1024 * 512 });
    ytdl.getInfo(link, options).then(info => {
        audioStream = ytdl.downloadFromInfo(info, { ...options, quality: 'highestaudio' });
        videoStream = ytdl.downloadFromInfo(info, { ...options, quality: 'highestvideo' });
        // create the ffmpeg process for muxing
        ffmpegProcess = cp.spawn(ffmpegPath, [
            // supress non-crucial messages
            '-loglevel', '8', '-hide_banner',
            // input audio and video by pipe
            '-i', 'pipe:3', '-i', 'pipe:4',
            // map audio and video correspondingly
            '-map', '0:a', '-map', '1:v',
            // no need to change the codec
            '-c', 'copy',
            // output matroska (mkv) and pipe
            '-f', options.outputFormat || 'matroska', 'pipe:5'
        ], {
            // no popup window for Windows users
            windowsHide: true,
            stdio: [
                // silence stdin/out, forward stderr,
                'inherit', 'inherit', 'inherit',
                // and pipe audio, video, output
                'pipe', 'pipe', 'pipe'
            ]
        });
        audioStream.pipe(ffmpegProcess.stdio[3]);
        videoStream.pipe(ffmpegProcess.stdio[4]);
        ffmpegProcess.stdio[5].pipe(result);
    });
    return result;
};

// export it
module.exports = ytmux;

// export other functions, in case you want them
ytmux.download = ytdl;
ytmux.chooseFormat = ytdl.chooseFormat;
ytmux.downloadFromInfo = ytdl.downloadFromInfo;
ytmux.filterFormats = ytdl.filterFormats;
ytmux.getBasicInfo = ytdl.getBasicInfo;
ytmux.getInfo = ytdl.getInfo;
ytmux.getURLVideoID = ytdl.getURLVideoID;
ytmux.getVideoID = ytdl.getVideoID;
ytmux.validateID = ytdl.validateID;
ytmux.validateURL = ytdl.validateURL;
