import {ipcRenderer} from 'electron';
import store         from '../store/index';
import * as _        from '../../js/utils';

const map = {};

ipcRenderer.on('response', (event, {error = false, id, data}) => {
    const {resolve, reject} = map[id];

    /* eslint-disable no-console */
    if (!resolve || !reject) {
        console.error('[IPC-CLIENT] Cannot resolve request', event, id, data);
    }

    if (!data) {
        console.error('[IPC-CLIENT] No data received', event, id, data);
    }

    if (error) {
        reject(data);
    } else {
        resolve(data);
    }
});

ipcRenderer.on('add-download', (event, data) => store.commit('downloads/add', data));
ipcRenderer.on('update-download', (event, data) => store.commit('downloads/update', data));

export default {

    async request(channel, data) {
        const id = _.createUID();
        ipcRenderer.send(channel, {data, id});
        return new Promise((resolve, reject) => map[id] = {resolve, reject});
    }
};
