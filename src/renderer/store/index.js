import Vuex from 'vuex';
import Vue from 'vue';

// Modules
import {downloads} from './modules/downloads';
import {dialogbox} from './modules/dialogbox';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        // Holds current downloads
        downloads,

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
    }
});
