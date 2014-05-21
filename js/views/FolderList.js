"use strict";

var React = require('react');

var FOLDERS = ['main', 'archive', 'trash'];

function capitalize(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.substr(1);
}

var FolderList = React.createClass({
  render: function() {
    var activeFolder = this.props.folder;
    return React.DOM.ul({className: 'folder-list'},
      FOLDERS.map(function(folder) {
        var classes = folder === activeFolder ? 'active-folder' : '';
        return React.DOM.li({className: classes, key: folder},
          React.DOM.a({href: '#/' + folder}, capitalize(folder)));
      }));
  }
});

module.exports = FolderList;
