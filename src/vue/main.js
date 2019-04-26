import Vue from 'vue';

import App    from './App';
import router from './router';
import store  from './store';

import 'typeface-open-sans';

import * as _ from '../js/utils';
import config from '../../config/config';

Vue.config.productionTip = false;
Vue.prototype.utils = _;
Vue.prototype.config = config;

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
