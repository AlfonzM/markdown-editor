// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, ipcMain, dialog, Menu, BrowserWindow } from 'electron';
import { devMenuTemplate } from './helpers/dev_menu_template';
import { editMenuTemplate } from './helpers/edit_menu_template';
import { fileMenuTemplate } from './helpers/file_menu_template';
import { mainMenuTemplate } from './helpers/main_menu_template';
import createWindow from './helpers/window';
import fs from 'fs';


// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;

var setApplicationMenu = function () {
    var menus = [];
    menus.push(mainMenuTemplate);
    menus.push(fileMenuTemplate);
    menus.push(editMenuTemplate);
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on('ready', function () {
    var mainWindow = createWindow('main', {
        width: 1000,
        height: 800,
    });

    setApplicationMenu();

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name !== 'production') {
        // mainWindow.openDevTools();
    }
});

app.on('window-all-closed', function () {
    app.quit();
});



// IPC Listeners

ipcMain.on('saveFile', (event, data) => {
    dialog.showSaveDialog(BrowserWindow.getFocusedWindow(),
        {
            defaultPath: 'Untitled.md',
            function(fileName) {
            if (fileName === undefined) return;
            fs.writeFile(fileName, data, function (err) {   
            })
        }
    })  
})