import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';

import 'typeface-open-sans';

import * as _ from '../js/utils';


Vue.config.productionTip = false;
Vue.prototype.utils = _;

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
