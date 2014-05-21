"use strict";

var _ = require('underscore');
var React = require('react');
var Router = require('director').Router;

var ContentPane = require('./views/ContentPane');
var FolderList = require('./views/FolderList');

var App = React.createClass({
  getInitialState: function() {
    return {
      viewType: 'list', // or 'note'
      folder: 'main', // only used if viewType 'list'
      noteId: '4' // only used if viewType 'note'
    };
  },

  render: function() {
    return React.DOM.div(null,
      React.DOM.div({className: 'pure-u-1-5'},
        FolderList(this.state.viewType === 'list' ?
                   {folder: this.state.folder}
                   : null)),
      React.DOM.div({className: 'pure-u-4-5'},
        ContentPane(_.pick(this.state, 'viewType', 'folder', 'noteId'))));
  }
});

var reactEl = document.getElementById('react-container');
var mountedApp = React.renderComponent(App(), reactEl);

var router = Router({
  '/(main|archive|trash|)': function(folder) {
    mountedApp.setState({viewType: 'list', folder: folder || 'main'});
  },
  '/note/:id': function(id) {
    mountedApp.setState({viewType: 'note', noteId: id});
  }
});

router.init();
