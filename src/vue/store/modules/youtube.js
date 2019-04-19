import {getLatestVideosByChannel, getPlaylistVideos} from '../../wrapper-apis/youtube';

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
            const channels = (await Promise.all(channelIds.map(getLatestVideosByChannel)));

            // Sort videos
            for(const {videos} of channels){
                videos.sort((a, b) => b.published - a.published);
            }

            return channels;
        },

        /**
         * Resolves the playlist itself and it's containing videos
         * @param _
         * @param playlistId The playlist id
         * @returns {Promise<{videos: Array, info: *}>}
         */
        async resolvePlaylist(_, {playlistId}) {
            return getPlaylistVideos(playlistId);
        }
    }
};
