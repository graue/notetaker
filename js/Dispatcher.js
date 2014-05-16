var _ = require('underscore');
var Promise = require('es6-promise').Promise;

var _callbacks = [];
var _promises = [];

function _addPromise(callback, payload) {
  _promises.push(new Promise(function(resolve, reject) {
    if (callback(payload)) {
      resolve(payload);
    } else {
      reject(new Error('Dispatcher callback unsuccessful'));
    }
  }));
}

function _clearPromises() {
  _promises = [];
}

exports.register = function(callback) {
  _callbacks.push(callback);
  return _callbacks.length - 1; // Index of newly added callback.
};

exports.dispatch = function(payload) {
  _callbacks.forEach(function(cb) {
    _addPromise(cb, payload);
  });
  Promise.all(_promises).then(_clearPromises);
};

exports.handleViewAction = function(action) {
  exports.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};
