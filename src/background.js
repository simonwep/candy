import {app, BrowserWindow, protocol}       from 'electron';
import {createProtocol, installVueDevtools} from 'vue-cli-plugin-electron-builder/lib';
import path                                 from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], {secure: true});

/* eslint-disable */
function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        title: 'Candy Downlaoder',
        icon: path.resolve(__dirname, '../', 'assets/icons/512x512.png')
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        win.loadURL('app://./index.html');
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
        createWindow();
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

    createWindow();
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
