var PendingTasksMixin = {
  componentWillMount: function() {
    this.timeouts = {};
  },

  // Call `func` after `delay` milliseconds. If `flush` is provided and true,
  // run the timeout before unmounting; otherwise, the timeout is discarded
  // if the component is unmounted before it has been run. Returns a numeric
  // timeout ID.
  setTimeout: function(func, delay, flush) {
    var that = this;

    var id = setTimeout(function() {
      delete that.timeouts[id];
      func();
    }, delay);

    this.timeouts[id] = [func, !!flush];
    return id;
  },

  // Clear the timeout with the given ID.
  // The timeout is not run, regardless of whether `flush` was passed.
  // The timeout must have been set by calling this.setTimeout() on this
  // component.
  clearTimeout: function(id) {
    if (this.timeouts[id]) {
      clearTimeout(id);
      delete this.timeouts[id];
    }
  },

  componentWillUnmount: function() {
    var timeouts = this.timeouts;
    Object.keys(timeouts).forEach(function(id) {
      clearTimeout(id | 0);
      // If `flush` was passed, run the function now.
      if (timeouts[id][1]) {
        timeouts[id][0]();
        delete timeouts[id];
      }
    });
  },

  // Returns a wrapped version of `func` that is only called after it
  // *stops* being called for `delay` milliseconds.
  //
  // If the component is unmounted before that happens, the function:
  //   * Is never called, if `flush` was not passed.
  //   * Is called immediately, if `flush` was passed as true.
  debounce: function(func, delay, flush) {
    var timeout;
    var that = this;

    return function() {
      var args = arguments;
      var counter = Math.floor(Math.random()*200);
      if (timeout !== undefined) {
        that.clearTimeout(timeout);
      }
      timeout = that.setTimeout(function() {
        func.apply(null, args);
        timeout = undefined;
      }, delay, !!flush);
    };
  }
};

module.exports = PendingTasksMixin;
