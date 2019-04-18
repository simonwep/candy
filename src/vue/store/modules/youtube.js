import {youtubeAPIKey, channelPreloadAmount} from '../../../../config/config';
import ipcClient                             from '../../ipc/client';

export const youtube = {

    namespaced: true,

    state: {},

    actions: {

        /**
         * Fetches the latest videos from a group of channels
         * @param _
         * @param channelIds An array of channel id's
         * @returns {Promise<void>}
         */
        async latestVideosBy(_, {channelIds = []}) {
            const videos = (await Promise.all(
                channelIds.map(v => {
                    return this.dispatch('fetch', {
                        transform: 'json',
                        url: 'https://www.googleapis.com/youtube/v3/search',
                        urlSearchParams: {
                            part: 'snippet',
                            key: youtubeAPIKey,
                            channelId: v,
                            maxResults: channelPreloadAmount,
                            order: 'date',
                            type: 'video'
                        }
                    }).then(async r => r.items.map(v => v.snippet));
                })
            )).flat();

            videos.sort((a, b) => {

                // Convert to timestamp
                [a, b].forEach(value => {
                    if (typeof value.publishedAt === 'string') {
                        value.publishedAt = +(new Date(value.publishedAt));
                    }
                });

                return b.publishedAt - a.publishedAt;
            });

            return videos;
        },

        /**
         * Resolves the playlist itself and it's containing videos
         * @param _
         * @param playlistId The playlist id
         * @returns {Promise<{videos: Array, info: *}>}
         */
        async resolvePlaylist(_, {playlistId}) {
            let playlist = {
                videos: [],
                info: (await this.dispatch('fetch', {
                    transform: 'json',
                    url: 'https://www.googleapis.com/youtube/v3/playlists',
                    urlSearchParams: {
                        part: 'snippet',
                        key: youtubeAPIKey,
                        id: playlistId
                    }
                })).items[0].snippet
            };

            const {videos} = playlist;
            let nextPageToken;
            do {
                const resp = await this.dispatch('fetch', {
                    transform: 'json',
                    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                    urlSearchParams: {
                        part: 'snippet',
                        maxResults: 50,
                        key: youtubeAPIKey,
                        pageToken: nextPageToken,
                        playlistId
                    }
                });

                if (!resp) {
                    throw 'Failed to fetch ids';
                }

                // Resolve more details
                const promises = [];
                for (const {snippet} of resp.items) {
                    promises.push(
                        ipcClient.request('getVideoInfo', snippet.resourceId.videoId).then(res => {
                            snippet.info = res;
                        })
                    );

                    videos.push(snippet);
                }

                await Promise.all(promises);
            } while (nextPageToken);

            return playlist;
        }
    }
};
