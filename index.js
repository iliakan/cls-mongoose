'use strict';

var shimmer = require('shimmer');


module.exports = function patchMPromise(ns) {

  if (typeof ns.bind !== 'function') {
    throw new TypeError("must include namespace to patch Mongoose Mpromise against");
  }

  shimmer.wrap(mongoose.Mongoose.prototype.Promise.prototype, 'on', function (original) {
    return function(event, callback) {
      callback = clsNamespace.bind(callback);
      return original.call(this, event, callback);
    };
  });
};

