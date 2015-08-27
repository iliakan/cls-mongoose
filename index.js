'use strict';

var shimmer = require('shimmer');
var mongoose = require('mongoose');

module.exports = function patchMPromise(ns) {

  if (typeof ns.bind !== 'function') {
    throw new TypeError("must include namespace to patch Mongoose against");
  }

  shimmer.wrap(mongoose.Mongoose.prototype.Query.prototype, 'exec', function (original) {
    return function(op, callback) {
      if (typeof op == 'function') op = ns.bind(op);
      if (typeof callback == 'function') callback = ns.bind(callback);
      return original.call(this, op, callback);
    };
  });

  shimmer.wrap(mongoose.Mongoose.prototype.Query.base, '_wrapCallback', function (original) {
    return function(method, callback, queryInfo) {
      if (typeof callback == 'function') callback = ns.bind(callback);
      return original.call(this, method, callback, queryInfo);
    };
  });
};

