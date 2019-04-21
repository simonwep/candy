import Vuex from 'vuex';
import Vue  from 'vue';

// Modules
import {downloads} from './modules/downloads';
import {youtube}   from './modules/youtube';
import {dialogbox} from './modules/dialogbox';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        // Holds current downloads
        downloads,

        // YouTube api related stuff
        youtube,

        // Dialog box content
        dialogbox
    },

    // Enable strict mode in development
    strict: process.env.NODE_ENV !== 'production',

    state: {
        clipBoardText: null
    },

    mutations: {

        /**
         * Updates the clipboard store
         * @param state
         * @param newText
         */
        updateClipBoardText(state, newText) {
            if (typeof newText === 'string') {
                state.clipBoardText = newText;
            }
        }
    },

    actions: {

        /**
         * Fetch wrapper with some extra features
         * @param _
         * @param url
         * @param urlSearchParams
         * @param init
         * @param transform
         * @returns {Promise<Response | never>}
         */
        async fetch(_, {url, urlSearchParams, init, transform = null}) {

            // Resolve params if provided
            let params = '';
            if (typeof urlSearchParams === 'object') {
                const searchParams = new URLSearchParams();
                Object.entries(urlSearchParams)
                    .forEach(([key, value]) => value !== undefined && searchParams.append(key, value));
                params = searchParams.toString();
            }

            return fetch(params ? `${url}?${params}` : url, init).then(r => {

                if (!r.ok) {
                    throw r;
                }

                if (['json', 'text'].includes(transform)) {
                    return r[transform]();
                }

                return r;
            });
        }
    }
});
