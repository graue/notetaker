"use strict";

var React = require('react');

var NoteSummary = React.createClass({
  handleClick: function() {
    // FIXME: to be Flux-y, this should go through a dispatcher to prevent
    // possible infinite loops, if I've understood Flux correctly.
    router.setRoute('note/' + this.props.id);
  },
  render: function() {
    return React.DOM.p({className: 'note-summary', onClick: this.handleClick},
      this.props.text);
  }
});

module.exports = NoteSummary;
