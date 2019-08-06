import {
    getPlaylistVideos,
    getChannelVideos
} from '../../wrapper-apis/youtube';

export const youtube = {

    namespaced: true,

    state: {},

    actions: {

        /**
         * Resolves the playlist itself and it's containing videos
         * @param _
         * @param playlistId The playlist id
         * @returns {Promise<{videos: Array, info: *}>}
         */
        async resolvePlaylist(_, {playlistId}) {
            return getPlaylistVideos(playlistId);
        },

        /**
         * Resolves all videos from a channel
         * @param _
         * @param channelId
         * @returns {Promise<void>}
         */
        async resolveChannelVideos(_, {channelId}) {
            return getChannelVideos(channelId);
        }
    }
};
