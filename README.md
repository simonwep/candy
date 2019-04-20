<h3 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/56439167-73b84600-62e5-11e9-98b8-9352f85cfef3.png" alt="Logo">
</h3>

<p align="center">
    <a href="https://github.com/Simonwep/Candy/tree/master"><img alt="Stable Branch" src="https://img.shields.io/badge/Stable%20Branch-master-3FB27F.svg"/></a>
    <a href="https://github.com/Simonwep/Candy/tree/dev"><img alt="Development Branch" src="https://img.shields.io/badge/Dev%20Branch-dev-3eacb2.svg"/></a>
    <img alt="Product state: Alpha" src="https://img.shields.io/badge/State-alpha-3c71b2.svg"/>
    <a href="https://www.patreon.com/simonwep"><img alt="Support me" src="https://img.shields.io/badge/Patreon-support-553cb2.svg"></a>
</p>

Candy is a YouTube downloaded with focus of flexibility and design. Let every download be a pleasure. It's backed with [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg),
[VueJS](https://vuejs.org/), [Electron](https://electronjs.org/) and [node-ytdl-core](https://github.com/fent/node-ytdl-core).

## Disclaimer
Downloading videos or music directly won't pay the work which was done by these who made it.
Please consider supporting the artists and creators if you really like their work, most of these have [patreon](https://www.patreon.com/)
or similar donation possibilities which can be used to directly giving them something back - it's even better than watching their videos on youtube.

## Features

Candy is currently only build for windows, linux and MacOS support is in progress - but if anyone want to use it now it's possible to clone
this repo and build it with `electron:build` for the current platform.

See [GitHub Projects](https://github.com/Simonwep/Candy/projects) for the current roadmap.

#### Currently: 
* Cross-platform and enjoyable UI.
* Playlist, video and channel download support.
* Many container formats are supportet, thanks to [ffmpeg](https://ffmpeg.org/).
* Donwload video, audio or combine a video quality with the audio you want.
* Frontpage with list of latest videos by the channels you choose.
* *No APIKey or similar required - just install 'n use*

## FAQ
1. "Downloads don't work anymore!" - _It's always a race between the maintainer of such applications and YouTube. YouTube doesn't provide
free access to many of these informations Candy provides so everything is accomplished with small hacks. If YouTube changes something
some methods won't work anymore. [Open an issue](https://github.com/Simonwep/Candy/issues/new) if so._
2. "What about other platforms?" - _For now Candy should and will only be a downloader for YouTube._
3. "The number of playlist / channel items is not equal to these on YouTube?!" - _YouTube counts private and removed videos in a playlist as 
videos of this playlist. Candy won't take this into account so it's possible that some videos are missing._

## Screenshots
![image](https://user-images.githubusercontent.com/30767528/56439931-1376d380-62e8-11e9-80ce-5ce3754ab10a.png)
