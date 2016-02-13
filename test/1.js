'use strict';

const cls = require('continuation-local-storage');
const clsNamespace = cls.createNamespace('app');

const mongoose = require('./mongoose');
//let clsMongoose = require('..');
//clsMongoose(clsNamespace);

describe("mongoose with cls", function() {

  let TestModel = mongoose.model('test_model');

  before(function(done) {
    mongoose.connect('mongodb://localhost/mongoose-cls-test', done);
  });

  after(function() {
    mongoose.disconnect();
  });

  it("Model#find callback", function*() {

    var requestId = Math.random();

    yield new Promise(clsNamespace.bind(function (resolve) {
      resolve();
    }));

    clsNamespace.set('requestId', requestId);
    yield TestModel.findOne({});

    console.log(clsNamespace.get('requestId'));

  });

});

