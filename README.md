<h3 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/56439167-73b84600-62e5-11e9-98b8-9352f85cfef3.png" alt="Logo" width="400">
</h3>

<p align="center">
    <a href="https://github.com/Simonwep/candy/actions"><img alt="CI" src="https://github.com/Simonwep/candy/workflows/CI/badge.svg"/></a>
    <a href="https://www.patreon.com/simonwep"><img alt="Support me" src="https://img.shields.io/badge/Patreon-support-553cb2.svg"></a>
    <a href="https://github.com/sponsors/Simonwep"><img alt="GitHub Sponsors" src="https://img.shields.io/badge/GitHub-sponsor-0A5DFF.svg"></a>
    <a href="https://www.buymeacoffee.com/aVc3krbXQ"><img alt="Buy me a Coffee" src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-donate-FF813F.svg"></a>
    <a href="https://www.patreon.com/simonwep"><img alt="Support on Patreon" src="https://img.shields.io/badge/Patreon-support-FA8676.svg"></a>
</p>

<p align="center">
Candy is a YouTube downloader with focus of flexibility and design. Let every download be a pleasure. It's backed with  <a href="https://github.com/fluent-ffmpeg/node-fluent-ffmpeg">fluent-ffmpeg</a>, <a href="https://vuejs.org/">Vue</a> and <a href="https://github.com/fent/node-ytdl-core">node-ytdl-core</a>
</p>

![cb](https://user-images.githubusercontent.com/30767528/56775738-b63bc000-67c8-11e9-84e0-18004bac3dc3.PNG)

### Disclaimer
Downloading videos or music directly won't pay the work which was done by these who made it.
Please consider supporting the artists and creators if you really like their work, most of these have [patreon](https://www.patreon.com/)
or similar donation possibilities which can be used to directly giving them something back - it's even better than watching their videos on youtube.

> Code disclaimer: I started this project in my "early" days, don't expect clean code.

### Features:
* Cross-platform and enjoyable UI.
* Playlist, video and channel download support.
* Many container formats are supportet, thanks to [ffmpeg](https://ffmpeg.org/).
* Download video, audio or merge audio / video streams independely.
* *No APIKey or similar required - just install and use it*

### FAQ
1. "Downloads don't work anymore!" - _It's always a race between the maintainer of such applications and YouTube. YouTube doesn't provide
free access to many of these information Candy provides, so everything is accomplished with small hacks. If YouTube changes something
some methods won't work anymore. [Open an issue](https://github.com/Simonwep/candy/issues/new) if so._
2. "What about other platforms?" - _For now Candy should and will only be a downloader for YouTube._
3. "The number of playlist / channel items is not equal to these on YouTube?!" - _YouTube counts private and removed videos in a playlist as
videos of this playlist. Candy won't take this into account, so it's possible that some videos are missing._
4. "Some downloads, mostly audio stuff, is especially slow?" - _Since it dosn't make sense to provide high bandwidth for most of YouTube's ressources (Streaming doesn't need that much) it takes longer
than other, direct downloads. It's not possible to speed it up until YouTube rises his bandwidth._
