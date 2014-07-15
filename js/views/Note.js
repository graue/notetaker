"use strict";

var _ = require('underscore');
var React = require('react');

var Dispatcher = require('../Dispatcher');
var NoteStore = require('../NoteStore');
var PendingTasksMixin = require('./mixins/PendingTasksMixin');

var Note = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  mixins: [PendingTasksMixin],

  getInitialState: function() {
    // Logically props, but loaded asynchronously, so we don't have these
    // at first. componentDidMount fetches them.
    return {
      note: undefined,
      rev: undefined
    };
  },

  saveText: function(newText) {
    Dispatcher.handleViewAction({
      actionType: 'EDIT_NOTE',
      newContents: _.defaults({text: newText}, this.state.note),
      id: this.props.id,
      rev: this.state.rev
    });
  },

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
      return React.DOM.div({className: 'note'}, '');
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

    // FIXME: better way to use debounce from the PendingTasksMixin?
    // We can't call debounce at the call site b/c then we get a different
    // debounced function for every call -> useless. But we can't call it
    // during the definition either, because `this` doesn't exist.
    // Here's the hacky workaround - do it at mount time.
    this.saveText = this.debounce(this.saveText, 500, true);

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
