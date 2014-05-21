"use strict";

var React = require('react');

var Dispatcher = require('../Dispatcher');
var NoteStore = require('../NoteStore');
var NoteSummaryList = require('./NoteSummaryList');
var SearchBox = require('./SearchBox');

var FilterableNoteList = React.createClass({
  getInitialState: function() {
    return {
      notes: undefined,
      searchText: ''
    };
  },

  queryNotes: function(folder, searchText) {
    var that = this;

    var q = this.lastQ = NoteStore.queryInFolder(folder, searchText)
      .then(function(notes) {
        // Disregard stale queries.
        if (q !== that.lastQ || !that.isMounted()) {
          return;
        }

        that.setState({notes: notes});
      }).catch(function(err) {
        console.log('FNL: error fetching notes', err); // XXX
      });
  },

  componentDidMount: function() {
    this.queryNotes(this.props.folder, this.state.searchText);
  },

  componentWillUpdate: function(nextProps, nextState) {
    // We can't call setState() from within here, but it should be ok to do
    // so asynchronously (to update this.state.notes).
    if (nextProps.folder !== this.props.folder ||
        nextState.searchText !== this.state.searchText) {
      this.queryNotes(nextProps.folder, nextState.searchText);
    }
  },

  setSearchText: function(newText) {
    this.setState({searchText: newText});
  },

  handleNewNote: function() {
    Dispatcher.handleViewAction({actionType: 'NEW_NOTE'});
  },

  render: function() {
    var searchText = this.state.searchText;

    return React.DOM.div({className: 'filterable-note-list'},
      React.DOM.div({className: 'controls'},
        React.DOM.button({className: 'pure-button new-note-button',
                          onClick: this.handleNewNote},
                        'New Note'),
        SearchBox({
          searchText: this.state.searchText,
          onTextChange: this.setSearchText
        })),
      this.state.notes ? NoteSummaryList({notes: this.state.notes})
        : React.DOM.p(null, 'Still loading, hang on...'));
  }
});

module.exports = FilterableNoteList;
