import Vuex        from 'vuex';
import Vue         from 'vue';
// Modules
import {downloads} from './modules/downloads';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        // Holds current downloads
        downloads
    },

    // Enable strict mode in development
    strict: process.env.NODE_ENV !== 'production'
});
