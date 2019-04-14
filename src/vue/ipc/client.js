import {ipcRenderer} from 'electron';

const map = {};

ipcRenderer.on('response', (event, {id, data}) => {
    const resolver = map[id];

    /* eslint-disable no-console */
    if (!resolver) {
        console.error('[IPC-CLIENT] Cannot resolve request', event, id, data);
    }

    if (!data) {
        console.error('[IPC-CLIENT] No data received', event, id, data);
    }

    resolver(data);
});

export default {

    async request(channel, data) {
        const id = Math.round(Math.random() * 1e15).toString(16) + Date.now().toString(16);
        ipcRenderer.send(channel, {data, id});
        return new Promise(resolve => map[id] = resolve);
    }
};
