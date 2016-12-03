'use scrict';

let _listeners = {};

let Dispatcher = function() {};
Dispatcher.prototype = {
  
  register(actionName, callback) {
    if (!_listeners[actionName]) {
      _listeners[actionName] = [];
    }

    _listeners[actionName].push(callback);
  },

  notifyAll(actionName, ...args) {
    let callbacks = _listeners[actionName] || [];
    callbacks.forEach(callback => {
      callback.call(callback, ...args);
    });
  }
};

let appDispacher = new Dispatcher();

export default appDispacher;