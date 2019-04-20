export const downloads = {

    namespaced: true,

    state: [],

    mutations: {

        add(state, video) {
            state.push(video);
        },

        update(state, {id, props}) {
            const video = state.find(v => v.id === id);
            video && Object.assign(video, props);
        }
    }
};
