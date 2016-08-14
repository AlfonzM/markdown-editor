import fs from 'fs';
import { dialog, BrowserWindow } from 'electron';
import low from 'lowdb';

export var fileMenuTemplate = {
    label: 'File',
    submenu: [
    { label: "New note", accelerator: "CmdOrCtrl+N", click: function() { console.log('new') } },
    { label: "Open", accelerator: "CmdOrCtrl+O", click: function() { 
        var filename = dialog.showOpenDialog(BrowserWindow.getFocusedWindow(),
        {
            properties: ['openFile'],
            filters: [{name: 'Text', extensions: ['txt', 'md']}]
        })

        if(!filename) return;

        fs.readFile(filename[0], 'utf8', function (err, data) {
            if(err) {
                alert(err)
                return
            } else {
                console.log(data)
                console.log("yus")
                BrowserWindow.getFocusedWindow().webContents.send('loadEditorContents', data)
            }
        });
    }},
    { label: "Save", accelerator: "CmdOrCtrl+S", click: function() { 
        const db = low(__dirname + '/notesdb123')

        db.defaults({'notes': []}).value()
        var notes = db.get('notes').value()

        BrowserWindow.getFocusedWindow().webContents.send('test', notes)
        BrowserWindow.getFocusedWindow().webContents.send('getEditorContents')
    }},
    ]
};