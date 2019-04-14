const {ipcMain} = require('electron');
const events = require('./events');

for (const [key, val] of Object.entries(events)) {

    // Validate
    if (typeof key !== 'number' || typeof val !== 'function') {
        console.error('[IPC-SERVER] Invalid construct: ', key, val);
    }

    // Set-up listener
    ipcMain.on(key, (event, {data, id}) => {

        // Fire handler
        val(data).then(data => {
            event.sender.send('response', {id, data});
        });
    });
}

