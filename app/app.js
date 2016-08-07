// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { ipcRenderer, remote, dialog, shell } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
import marked from 'marked';
import $ from 'jquery';
import low from 'lowdb';
import uuid from 'node-uuid';

const db = low('db')
var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());
var $editor, $output;
var notes = [];
var currentNote;

$(document).ready(function (){
	$editor = $("#editor");
	$output = $("#output");

	marked.setOptions({
		highlight: function (code) {
			return require('highlight.js').highlightAuto(code).value;
		}
	});

	// console.log(db.setState({})) // CLEAR DB

	fetchNotesFromDB()

	// Input change handler
	$editor.bind('input propertychange', function(){
		saveNote()
		refreshOutput();
	});

	// Force link clicks to open in default OS browser
	$('#a').bind('click', function(e){
		e.preventDefault();
		shell.openExternal($(this).attr('href'));
	});

	// Toggle sidebar button
	$('#toggle-sidebar').bind('click', function(e){
		$('#sidebar').animate({"margin-left":'-=200'}, 200, 'swing');
	});

	// Select note from sidebar
	$('#sidebar ul.sidebar-notes li.sidebar-note').on('click', function(e){
		selectANoteFromTheSidebar($(this))
	})
});

function fetchNotesFromDB(){
	db.defaults({'notes': []}).value()

	notes = db.get('notes').value()

	if(notes.length == 0){
		console.log("OMG")
		db.get('notes').push({'id': uuid.v4(), 'body':'# New Note qwjeqwjlkeqwlk', 'updated_at': new Date().getTime()}).value()
		db.get('notes').push({'id': uuid.v4(), 'body':'# hello!\n\nomg this is really awesome', 'updated_at': new Date().getTime()}).value()
		db.get('notes').push({'id': uuid.v4(), 'body':'aw yiss', 'updated_at': new Date().getTime()}).value()
	} else {
		console.log(notes)
	}

	addNotesToSidebar()
	selectANoteFromTheSidebar($('#sidebar ul.sidebar-notes li.sidebar-note:first'))
}

function displayNote(note){
	currentNote = note;
	$editor.val(note.body);
	refreshOutput();
}

function addNotesToSidebar(){
	notes.map(function(note){
		$('ul.sidebar-notes').prepend('<li id="' + note.id + '" class="sidebar-note"><p><b>' + note.body.substr(0,15) + '...</b></p><p>' + note.updated_at + '</p></li>');
	});
}

function selectANoteFromTheSidebar($noteElement){
	var id = $noteElement.attr('id')

	var note = notes.find(function (o){
		{ return o.id == id }
	})

	$('.active').removeClass('active')
	$noteElement.addClass('active')

	displayNote(note)
}

function saveNote(){
	currentNote.body = $editor.val()
		body: currentNote.body,
		updated_at: new Date().getTime()
	}).value())
}

function refreshOutput(){
	$output.html(marked($editor.val()));
}

ipcRenderer.on('getEditorContents', function(event){
	ipcRenderer.send('saveFile', $editor.val())
});

ipcRenderer.on('loadEditorContents', function(event, data){
	$editor.val(data)
	refreshOutput();
});