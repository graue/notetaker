"use strict";

var _ = require('underscore');
var React = require('react');

var FilterableNoteList = require('./FilterableNoteList');
var Note = require('./Note');

var ContentPane = React.createClass({
  render: function() {
    return React.DOM.div({className: 'content-pane'},
      this.props.viewType === 'list' ?
        FilterableNoteList(_.pick(this.props, 'notes', 'folder',
                                              'searchText')) :
        Note(_.where(this.props.notes, {id: this.props.noteId})[0]));
  }
});

module.exports = ContentPane;
