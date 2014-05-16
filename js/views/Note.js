"use strict";

var _ = require('underscore');
var React = require('react');

var Dispatcher = require('../Dispatcher');

var Note = React.createClass({
  saveText: _.debounce(function(newText) {
    Dispatcher.dispatch({
      actionType: 'EDIT_NOTE',
      // FIXME: tight coupling - what if stuff gets into this.props
      // that we don't want in the document?
      newContents: _.defaults({text: newText}, this.props)
    });
  }, 500),

  handleChange: function(event) {
    this.saveText(event.target.value);
  },

  setFolderTo: function(folder) {
    var oldFolder = this.props.folder;
    Dispatcher.dispatch({
      actionType: 'EDIT_NOTE',
      // FIXME: tight coupling - what if stuff gets into this.props
      // that we don't want in the document? (as above)
      newContents: _.defaults({folder: folder}, this.props),
      thenRouteTo: '/' + oldFolder
    });
  },

  render: function() {
    return React.DOM.div({className: 'note'},
      React.DOM.div({className: 'controls'},
        React.DOM.button({className: 'pure-button archive-button',
                          onClick: this.setFolderTo.bind(this, 'archive')},
                         'Archive'),
        React.DOM.button({className: 'pure-button trash-button',
                          onClick: this.setFolderTo.bind(this, 'trash')},
                         'Trash')),
      React.DOM.p({className: 'note-header-text'},
                   'Noted ', this.props.created),
      React.DOM.form({className: 'pure-form'},
        React.DOM.textarea({
          className: 'note-edit pure-input-1',
          defaultValue: this.props.text,
          onChange: this.handleChange
        })));
  }
});

module.exports = Note;
