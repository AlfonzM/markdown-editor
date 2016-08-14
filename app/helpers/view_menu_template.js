import { BrowserWindow } from 'electron';

export var viewMenuTemplate = {
    label: 'View',
    submenu: [
        { label: "Show/Hide Preview", accelerator: "CmdOrCtrl+P", click: function(){
            BrowserWindow.getFocusedWindow().webContents.send('togglePreview');
        }}
    ]
};
