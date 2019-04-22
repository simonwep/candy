export const downloads = {

    namespaced: true,

    state: [],

    mutations: {

        add(state, video) {
            state.push(video);
            sortVideos(state);
        },

        update(state, {id, props}) {
            const video = state.find(v => v.id === id);

            if (video) {
                const statusChanged = props.status && props.status !== video.status;
                Object.assign(video, props);

                // Check if status has changed
                if (statusChanged) {
                    sortVideos(state);
                }
            }

            video && Object.assign(video, props);
        }
    }
};

function sortVideos(state) {
    const sortMap = ['errored', 'cancelled', 'finish', 'convert', 'progress', 'paused'];
    state.sort((a, b) => sortMap.indexOf(b.status) - sortMap.indexOf(a.status));
}
