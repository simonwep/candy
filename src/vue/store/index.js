import Vuex from 'vuex';
import Vue  from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: [],

    // Enable strict mode in development
    strict: process.env.NODE_ENV !== 'production'
});
