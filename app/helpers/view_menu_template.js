import { BrowserWindow } from 'electron';

export var viewMenuTemplate = {
    label: 'View',
    submenu: [
        { label: "Show Preview", accelerator: "CmdOrCtrl+P", selector: function(){
            BrowserWindow.getFocusedWindow().webContents.send('togglePreview')
        }}
    ]
};
