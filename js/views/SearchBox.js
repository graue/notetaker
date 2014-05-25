"use strict";

var React = require('react');

var SearchBox = React.createClass({
  handleChange: function(event) {
    this.props.onTextChange(event.target.value);
  },
  render: function() {
    return React.DOM.form({className: 'pure-form search-box'},
      React.DOM.span({className: 'typcn typcn-zoom-outline'}),
      React.DOM.input({
        id: 'search-input',
        defaultValue: this.props.searchText,
        onChange: this.handleChange
      }));
  }
});

module.exports = SearchBox;
