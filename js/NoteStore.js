var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var PouchDB = require('pouchdb');
var Promise = require('es6-promise').Promise;

var Dispatcher = require('./Dispatcher');

var db = new PouchDB('notes');

var NoteStore = _.extend({}, EventEmitter.prototype, {
  getById: function(id) {
    return new Promise(function(resolve, reject) {
      db.get(id, function(err, response) {
        if (err) reject(err);
        resolve(response);
      });
    });
  },

  queryInFolder: function(folder, searchText) {
    // FIXME: I can find zero examples of how to do filtering in
    // Couch/PouchDB, so let's just get *all* the documents and filter
    // them ourselves, because I'm tired of being blocked on this.
    searchText = searchText.trim().toLowerCase();
    return new Promise(function(resolve, reject) {
      db.allDocs({include_docs: true}, function(err, response) {
        if (err) reject(err);
        var filteredDocs = response.rows.map(function(row) {
          return row.doc;
        }).filter(function(doc) {
          return (doc.folder === folder &&
            (!searchText || ~doc.text.toLowerCase().indexOf(searchText)));
        });
        resolve(filteredDocs);
      });
    });
  },

  emitChange: function(id, newRev, newContents) {
    this.emit('change', id, newRev, newContents);
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
      var documentPayload = _.defaults(
        {_id: action.id, _rev: action.rev},
        action.newContents
      );

      db.put(documentPayload, function(err, response) {
        // FIXME: ungraceful error handling
        if (err) throw(err);
        if (!response.ok) throw new Error('response.ok is falsy');

        NoteStore.emitChange(response.id, response.rev, action.newContents);
        if (action.thenRouteTo) {
          // FIXME: use router.setRoute() instead
          window.location.hash = action.thenRouteTo;
        }
      });

    } else if (action.actionType === 'NEW_NOTE') {
      db.post({
        folder: 'main',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        text: ''
      }, function(err, response) {
        if (err) throw(err); // FIXME
        window.location.hash = '/note/' + response.id;
      });

    } else if (action.actionType === 'VIEW_NOTE') {
      // FIXME: use router.setRoute()
      // FIXME: should this be here? Has nothing to do with the NoteStore,
      // we're only changing *app* state.
      window.location.hash = '/note/' + action.id;

    } else {
      throw new Error('Unknown actionType ' + action.actionType);
    }

    return true; // Tell the promise in Dispatcher there were no errors.
  })
});

module.exports = NoteStore;
