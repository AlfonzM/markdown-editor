import fs from 'fs';
import $ from 'jquery';
const { dialog, ipcRenderer } = require('electron');

console.log(ipcRenderer)

export var fileMenuTemplate = {
    label: 'File',
    submenu: [
    { label: "New note", accelerator: "CmdOrCtrl+N", click: function() { console.log('new') } },
    { label: "Open", accelerator: "CmdOrCtrl+O", click: function() { 
        var filename = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{name: 'Text', extensions: ['txt', 'md']}]
        })

        console.log(filename)
    }},
    { label: "Save", accelerator: "CmdOrCtrl+S", click: function() { 
        ipcRenderer.send('saveFile', 'asd')
    }},
    ]
};
