const {getVideoInfo} = require('./downloads');
const {log} = require('./log');
const fetch = require('node-fetch').default;
// TODO: Refactor, this whole thing is chaotic

const fetchText = url => fetch(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4180.0 Safari/537.36'
    }
}).then(res => res.ok ? res.text() : Promise.reject(res));

const PLAYLIST_CHANNEL_REGEX = /playlist\?list=([\w-]+)/i;
const YT_INITIAL_DATA_REGEX = /.*ytInitialData".*?({.*?);[\s]+window/gm;

/**
 * All youtube pages come with some pre-defined content saved in a object named
 * ytInitialData. This function extracts this object from a yt page and returns it
 * as normal javascript object.
 * @param html
 * @returns {*}
 */
function extractYTInitialData(html) {
    const match = YT_INITIAL_DATA_REGEX.exec(html);

    try {
        return JSON.parse(match[1]);
    } catch (e) {
        log('ERROR', 'Failed to extract ytInitialData.');
        return null;
    }
}

/**
 * Resolves all playlistitems
 * @param playlistId
 * @returns {Promise<void>}
 */
async function getPlaylistVideos(playlistId) {
    const checkedVideoIds = [];

    // Fetch first raw page
    return fetchText(`https://www.youtube.com/playlist?list=${playlistId}`).then(async html => {
        const ytInitialData = extractYTInitialData(html);
        const {microformatDataRenderer} = ytInitialData.microformat;
        const playlistItems = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;

        // Resolve first <100 videos
        return {
            info: microformatDataRenderer,
            videos: await Promise.all(playlistItems.map(
                v => {
                    const {videoId} = v.playlistVideoRenderer;
                    checkedVideoIds.push(videoId);
                    return getVideoInfo(videoId).catch(() => null);
                }
            ))
        };
    }).then(async ({info, videos}) => {
        videos = videos.filter(Boolean); // Remove dead links

        // Youtube renders at least 99 items on the first page. If so it's not required to fetch the next pages
        if (videos.length === 99) {
            let nextLink = checkedVideoIds[videos.length - 1];

            while (nextLink) {

                // Fetch playlist-video pages html content
                const nextPage = await fetchText(`https://www.youtube.com/watch?v=${nextLink}&list=${playlistId}`);

                if (!nextPage) {
                    throw new Error('Failed to fetch ids');
                }

                // Extract playlist ids
                const ytInitialData = extractYTInitialData(nextPage);
                const {contents} = ytInitialData.contents.twoColumnWatchNextResults.playlist.playlist;

                // Resolve ids and add these to the current list
                const promises = [];
                for (const {playlistPanelVideoRenderer: {videoId}} of contents) {
                    if (!checkedVideoIds.includes(videoId)) {
                        checkedVideoIds.push(videoId);
                        promises.push(getVideoInfo(videoId).catch(() => null));
                    }
                }

                // Check if something new has been added
                if (promises.length) {
                    videos.push(...(await Promise.all(promises)));
                    videos = videos.filter(Boolean); // Remove dead links
                    nextLink = checkedVideoIds[videos.length - 1];
                } else {
                    nextLink = null;
                }
            }
        }

        return {videos, info};
    });
}

/**
 * Resolves all videos from a channel
 * @param channelId
 * @returns {Promise<void>}
 */
async function getChannelVideos(channelId) {

    // Fetch playlist id
    const content = await fetchText(`https://www.youtube.com/channel/${channelId}/videos`)
        .catch(() => fetchText(`https://www.youtube.com/user/${channelId}/videos`))
        .catch(() => null);

    if (!content) {
        log('ERROR', 'Failed to fetch channel or user.');
        return null;
    }

    const playlistMatch = PLAYLIST_CHANNEL_REGEX.exec(content);
    if (!playlistMatch) {
        log('ERROR', 'Failed to extract channel / user playlist id.');
        return null;
    }

    // Return playlist videos
    return getPlaylistVideos(playlistMatch[1]);
}

module.exports = {
    getPlaylistVideos,
    getChannelVideos
};
