"use strict";

var _ = require('underscore');
var React = require('react');

var Dispatcher = require('../Dispatcher');
var NoteStore = require('../NoteStore');

var Note = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    // Logically props, but loaded asynchronously, so we don't have these
    // at first. componentDidMount fetches them.
    return {
      note: undefined,
      rev: undefined
    };
  },

  saveText: _.debounce(function(newText) {
    Dispatcher.handleViewAction({
      actionType: 'EDIT_NOTE',
      newContents: _.defaults({text: newText}, this.state.note),
      id: this.props.id,
      rev: this.state.rev
    });
  }, 500),

  handleChange: function(event) {
    this.saveText(event.target.value);
  },

  setFolderTo: function(folder) {
    var oldFolder = this.state.note.folder;
    Dispatcher.handleViewAction({
      actionType: 'EDIT_NOTE',
      newContents: _.defaults({folder: folder}, this.state.note),
      id: this.props.id,
      rev: this.state.rev,
      thenRouteTo: '/' + oldFolder
    });
  },

  render: function() {
    if (!this.state.note) {
      return React.DOM.div({className: 'note'},
        'Hang on, the note is still loading...');
    }

    return React.DOM.div({className: 'note'},
      React.DOM.div({className: 'controls'},
        React.DOM.button({className: 'pure-button archive-button',
                          onClick: this.setFolderTo.bind(this, 'archive')},
                         'Archive'),
        React.DOM.button({className: 'pure-button trash-button',
                          onClick: this.setFolderTo.bind(this, 'trash')},
                         'Trash')),
      React.DOM.p({className: 'note-header-text'},
                   'Noted ', this.state.note.created),
      React.DOM.form({className: 'pure-form'},
        React.DOM.textarea({
          className: 'note-edit pure-input-1',
          defaultValue: this.state.note.text,
          onChange: this.handleChange
        })));
  },

  componentDidMount: function() {
    var that = this;

    NoteStore.getById(this.props.id).then(function(response) {
      if (!that.isMounted()) return;

      that.setState({
        rev: response._rev,
        note: {
          folder: response.folder,
          created: response.created,
          modified: response.modified,
          text: response.text
        }
      });
    }).catch(function(error) {
      console.log('error fetching Note:', error); // XXX
    });

    NoteStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    NoteStore.removeChangeListener(this._onChange);
  },

  _onChange: function(id, rev, contents) {
    this.setState({
      note: contents,
      rev: rev
    });
  }
});

module.exports = Note;
