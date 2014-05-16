var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var PouchDB = require('pouchdb');

var Dispatcher = require('./dispatcher');

var db = new PouchDB('notes');

var NoteStore = _.extend({}, EventEmitter.prototype, {
  getById: function(id, callback) {
    return db.get(id, callback);
  },

  emitChange: function() {
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  },

  dispatcherIndex: Dispatcher.register(function(payload) {
    var action = payload.action;

    if (action.actionType === 'EDIT_NOTE') {
      db.put(action.newContents, function(err, response) {
        if (err) throw(err); // FIXME: ungraceful error handling
        NoteStore.emitChange();
        if (action.thenRouteTo) {
          // FIXME: use router.setRoute() instead
          window.location = action.thenRouteTo;
        }
      }
