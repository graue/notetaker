"use strict";

var React = require('react');

var SearchBox = React.createClass({
  handleChange: function(event) {
    this.props.onTextChange(event.target.value);
  },
  render: function() {
    return React.DOM.form({className: 'pure-form'},
      React.DOM.input({
        className: 'search-box',
        defaultValue: this.props.searchText,
        onChange: this.handleChange
      }));
  }
});

module.exports = SearchBox;
