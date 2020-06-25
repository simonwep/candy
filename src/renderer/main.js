import settings from 'electron-settings';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import * as _ from '../js/utils';
import config from '../../config/config';
import path from 'path';
import os from 'os';

// TODO: Fonts?
// import 'typeface-open-sans';

Vue.config.productionTip = false;
Vue.prototype.utils = _;
Vue.prototype.config = config;

// Set default-settings
const cs = settings.getSync();
if (!Object.keys(cs).length) {
    settings.setSync({
        createPlaylistDirectory: true,
        createChannelDirectory: true,
        deleteDownloadEntriesIfDone: false,
        downloadDirectory: path.resolve(os.homedir(), 'Downloads'),
        temporaryDirectory: path.resolve(os.tmpdir(), 'candy'),
        homeVideoChannels: []
    });
}

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
