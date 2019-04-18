import ipcClient from '../ipc/client';

function fetchText(url) {
    return fetch(url).then(res => {
        if (res.ok) {
            return res.text();
        } else {
            throw res;
        }
    });
}

function generateWindowFromHTML(html) {

    // Replace all request sources
    html = html.replace(/(src|href|link)=".*?"/g, '');

    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();

    return {window: iframe.contentWindow, close: () => document.body.removeChild(iframe)};
}

/**
 * Resolves the latest 30 videos from a channel
 * @param channelid
 * @returns {Promise<[any, any, any, any, any, any, any, any, any, any] | never>}
 */
export async function getLatestVideosByChannel(channelid) {
    return fetchText(`https://www.youtube.com/channel/${channelid}/videos`).then(async html => {
        const {window: {ytInitialData}, close} = generateWindowFromHTML(html);
        const rawVideos = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items;
        const videos = [];

        for (const {gridVideoRenderer: rv} of rawVideos) {
            videos.push(ipcClient.request('getVideoInfo', rv.videoId));
        }

        close();
        return Promise.all(videos);
    });
}

/**
 * Resolves all playlistitems
 * @param playlistId
 * @returns {Promise<void>}
 */
export async function getPlaylistVideos(playlistId) {

    // Fetch first raw page
    return fetchText(`https://www.youtube.com/playlist?list=${playlistId}`).then(async html => {
        const {window: {ytInitialData}, close} = generateWindowFromHTML(html);
        const {microformatDataRenderer} = ytInitialData.microformat;
        const playlistItems = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
        close();

        // Resolve first <100 videos
        return {
            info: microformatDataRenderer,
            videos: await Promise.all(playlistItems.map(
                v => ipcClient.request('getVideoInfo', v.playlistVideoRenderer.videoId)
            ))
        };
    }).then(async ({info, videos}) => {

        // Youtube renders at least 99 items on the first page. If so it's not required to fetch the next pages
        if (videos.length < 99 && !videos.length) {
            return videos;
        }

        let nextLink = videos[videos.length - 1].video_id;
        while (nextLink) {

            // Fetch playlist-video pages html content
            const nextPage = await fetchText(`https://www.youtube.com/watch?v=${nextLink}&list=${playlistId}`);

            if (!nextPage) {
                throw 'Failed to fetch ids';
            }

            // Extract playlist ids
            const {window: {ytInitialData}, close} = generateWindowFromHTML(nextPage);
            const {contents} = ytInitialData.contents.twoColumnWatchNextResults.playlist.playlist;
            close();

            // Resolve ids and add these to the current list
            const promises = [];
            for (const {playlistPanelVideoRenderer: {videoId}} of contents) {
                if (!videos.find(v => v.video_id === videoId)) {
                    promises.push(ipcClient.request('getVideoInfo', videoId));
                }
            }

            // Check if something new has been added
            if (promises.length) {
                videos.push(...(await Promise.all(promises)));
                nextLink = videos[videos.length - 1].video_id;
            } else {
                nextLink = null;
            }
        }

        return {videos, info};
    });
}

