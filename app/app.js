// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote, dialog } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
import marked from 'marked';
import $ from 'jquery';

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
// console.log('The author of this app is:', appDir.read('package.json', 'json').author);

$(document).ready(function (){
	marked.setOptions({
		highlight: function (code) {
			return require('highlight.js').highlightAuto(code).value;
		}
	});

	refreshOutput();
	
	$('#editor').bind('input propertychange', function(){
		refreshOutput();
		console.log(marked($('#editor').val()));
	});
});

function refreshOutput(){
	$('#output').html(marked($('#editor').val()));
}

var ipc = require('electron').ipcRenderer;

ipc.on('getEditorContents', function(event){
	console.log('as')
	ipc.send('saveFile', $("#editor").val())
});

ipc.on('loadEditorContents', function(event, data){
	$("#editor").val(data)
	refreshOutput();
});