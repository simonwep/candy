import Vuex from 'vuex';
import Vue  from 'vue';

Vue.use(Vuex);

// Modules
import {downloads} from './modules/downloads';

export default new Vuex.Store({
    modules: {

        // Holds current downloads
        downloads
    },

    // Enable strict mode in development
    strict: process.env.NODE_ENV !== 'production'
});
