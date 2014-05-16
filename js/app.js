"use strict";

var _ = require('underscore');
var React = require('react');
var Router = require('director').Router;

var ContentPane = require('./views/ContentPane');
var FolderList = require('./views/FolderList');

var App = React.createClass({
  getInitialState: function() {
    return {
      notes: [],
      viewType: 'list', // or 'note'
      folder: 'main', // only used if viewType 'list'
      noteId: '4' // only used if viewType 'note'
    };
  },

  setNote: function(id, key, value) {
    var notes = _.clone(this.state.notes);
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === id) {
        notes[i] = _.clone(notes[i]);
        notes[i][key] = value;
      }
    }
    this.setState({notes: notes});
  },

  // Adds a new empty note, returning the note's generated ID.
  addNewNote: function() {
    var notes = _.clone(this.state.notes);
    var id = (Math.random() * 2147483647) >> 0; // FIXME: use real UUID
    id += '';
    notes.push({
      id: id,
      folder: 'main',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      text: ''
    });
    this.setState({notes: notes});
    return id;
  },

  render: function() {
    return React.DOM.div(null,
      React.DOM.div({className: 'pure-u-1-5'},
        FolderList(this.state.viewType === 'list' ?
                   {folder: this.state.folder}
                   : null)),
      React.DOM.div({className: 'pure-u-4-5'},
        ContentPane(_.pick(this.state, 'notes', 'viewType', 'folder',
                                       'noteId'))));
  }
});

var reactEl = document.getElementById('react-container');
var mountedApp = React.renderComponent(App(), reactEl);

function dispatch(uiEvent) {
  var args = arguments;
  _.defer(function() {
    if (uiEvent.action === 'noteEdit') {
      mountedApp.setNote(uiEvent.id, 'text', uiEvent.text);
    } else if (uiEvent.action === 'moveToFolder') {
      mountedApp.setNote(uiEvent.id, 'folder', uiEvent.folder);
      if (uiEvent.viewNext) {
        router.setRoute('/' + uiEvent.viewNext);
      }
    } else if (uiEvent.action === 'newNote') {
      var newNoteId = mountedApp.addNewNote();
      router.setRoute('/note/' + newNoteId);
    }
  });
}

var router = Router({
  '/(main|archive|trash|)': function(folder) {
    mountedApp.setState({viewType: 'list', folder: folder || 'main'});
  },
  '/note/:id': function(id) {
    mountedApp.setState({viewType: 'note', noteId: id});
  }
});

router.init();
