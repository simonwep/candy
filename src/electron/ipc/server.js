const {ipcMain} = require('electron');
const events = {
    ...require('./events/downloads'),
    ...require('./events/settings'),
    ...require('./events/log')
};

for (const [key, val] of Object.entries(events)) {

    // Validate
    /* eslint-disable no-console */
    if (typeof key !== 'string' || !key || typeof val !== 'function') {
        console.error('[IPC-SERVER] Invalid construct: ', key, val);
    }

    // Set-up listener
    ipcMain.on(key, (event, {data, id}) => {

        // Fire handler
        val(data, event).then(data => {
            event.sender.send('response', {id, data});
        }).catch(err => {
            event.sender.send('response', {error: true, id, data: err});
        });
    });
}
