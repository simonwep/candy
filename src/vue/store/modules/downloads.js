export const downloads = {

    namespaced: true,

    state: [],

    mutations: {

        add(state, video) {
            state.push(video);
        },

        update(state, {id, props}) {
            const video = state.find(v => v.id === id);

            if (video) {
                const statusChanged = props.status && props.status !== video.status;
                Object.assign(video, props);

                // Check if status has changed
                if (statusChanged) {
                    const sortMap = ['errored', 'finish', 'convert', 'progress'];
                    state.sort((a, b) => sortMap.indexOf(b.status) - sortMap.indexOf(a.status));
                }
            }
        }
    }
};
