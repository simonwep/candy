import Vuex from 'vuex';
import Vue  from 'vue';

// Modules
import {downloads} from './modules/downloads';
import {youtube}   from './modules/youtube';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        // Holds current downloads
        downloads,

        // YouTube api related stuff
        youtube
    },

    // Enable strict mode in development
    strict: process.env.NODE_ENV !== 'production',

    actions: {

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
