const _ = require('../../js/utils.js');
const YouTube = require('simple-youtube-api');
let youtube;

module.exports = apikey => {

    // Create connection
    youtube = new YouTube(apikey);

    return {

        /**
         * Get all items of a playlist
         *
         * @param listId
         * @param props
         * @returns {Promise<PromiseLike<T | never>>}
         */
        async getPlaylistItems(listId, ...props) {

            // Start request
            return youtube.getPlaylistByID(listId)

            // Get the videos of the playlist
                .then(playlist => playlist.getVideos())

                // Filter response
                .then(videos => {

                    // Exits a filter
                    if (props.length > 0) {

                        // Props video list
                        const playListItems = [];

                        // Get each video
                        for (const video of videos) {

                            // Filter video info and add to the list
                            playListItems.push(_.pick(video, props));
                        }

                        // Return the props video list
                        return playListItems;
                    }

                    // Return the raw video list
                    return videos;
                });
        }
    };
};
