"use strict";

var React = require('react');

var Dispatcher = require('../Dispatcher');

var NoteSummary = React.createClass({
  handleClick: function() {
    Dispatcher.handleViewAction({actionType: 'VIEW_NOTE', id: this.props._id});
  },
  render: function() {
    return React.DOM.p({className: 'note-summary', onClick: this.handleClick},
      this.props.text);
  }
});

module.exports = NoteSummary;
