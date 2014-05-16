"use strict";

var _ = require('underscore');
var React = require('react');

var NoteSummary = require('./NoteSummary');

var NoteSummaryList = React.createClass({
  render: function() {
    var folder = this.props.folder;
    return React.DOM.div({className: 'note-summary-list'},
      this.props.notes.map(function(note) {
        return NoteSummary(_.extend({key: note.id}, note));
      }));
  }
});

module.exports = NoteSummaryList;
