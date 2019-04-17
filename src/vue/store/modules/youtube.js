import {youtubeAPIKey} from '../../../../config/config';
import ipcClient       from '../../ipc/client';

export const youtube = {

    namespaced: true,

    state: {},

    actions: {

        async resolvePlaylist(_, {playlistId}) {
            let playlist = {
                videos: [],
                playlist: (await this.dispatch('fetch', {
                    transform: 'json',
                    url: 'https://www.googleapis.com/youtube/v3/playlists',
                    urlSearchParams: {
                        part: 'snippet',
                        id: playlistId,
                        key: youtubeAPIKey
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
