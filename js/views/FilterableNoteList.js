"use strict";

var React = require('react');

var NoteSummaryList = require('./NoteSummaryList');
var SearchBox = require('./SearchBox');

var FilterableNoteList = React.createClass({
  getInitialState: function() {
    return {searchText: ''};
  },
  setSearchText: function(newText) {
    this.setState({searchText: newText.trim().toLowerCase()});
  },
  handleNewNote: function() {
    dispatch({action: 'newNote'});
  },
  render: function() {
    var searchText = this.state.searchText;
    var folder = this.props.folder;
    var filteredNotes = this.props.notes.filter(function(note) {
      return (note.folder === folder &&
              (!searchText ||
               note.text.toLowerCase().indexOf(searchText) !== -1));
    });

    return React.DOM.div({className: 'filterable-note-list'},
      React.DOM.div({className: 'controls'},
        React.DOM.button({className: 'pure-button new-note-button',
                          onClick: this.handleNewNote},
                        'New Note'),
        SearchBox({
          searchText: this.state.searchText,
          onTextChange: this.setSearchText
        })),
      NoteSummaryList({notes: filteredNotes}));
  }
});

module.exports = FilterableNoteList;
