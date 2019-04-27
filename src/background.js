import {app, BrowserWindow} from 'electron';
import {installVueDevtools} from 'vue-cli-plugin-electron-builder/lib';
import path                 from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

/* eslint-disable */
async function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        title: 'Candy YouTube Downloader',
        icon: path.resolve(__dirname, '../', 'assets/icons/512x512.png'),

        webPreferences: {

            // Allow CORS Requests
            webSecurity: false
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    } else {
        await win.loadURL('app://./index.html');
    }

    if ((process.env.WEBPACK_DEV_SERVER_URL || process.argv.includes('--debug')) && !process.env.IS_TEST) {
        win.webContents.openDevTools();
    }

    win.setMenuBarVisibility(false);
    win.on('closed', () => win = null);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        return createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installVueDevtools();
        } catch (e) {
            console.error('Vue Devtools failed to install: ', e.toString());
        }
    }

    await createWindow();
    require('./electron/ipc/server');
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
