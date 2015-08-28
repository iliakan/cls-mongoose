'use strict';

var cls = require('continuation-local-storage');
const clsNamespace = cls.createNamespace('app');

var mongoose = require('mongoose');

var clsMongoose = require('..');
clsMongoose(clsNamespace);

var getMongooseVersion = function() {
  var fs = require('fs');
  var file = 'node_modules/mongoose/package.json';
  file = fs.readFileSync(file, 'utf8');
  var json = JSON.parse(file);
  var version = json.version;
  return (version);
};

describe("mongoose with cls", function() {

  var mongooseVersion = getMongooseVersion();

  var TestModel = mongoose.model('test_model', mongoose.Schema({value: String}));

  before(function*() {

    var context = clsNamespace.createContext();
    clsNamespace.enter(context);

    clsNamespace.set("value", 1);

    yield function(callback) {
      mongoose.connect('mongodb://localhost/mongoose-cls-test', callback);
    };
  });


  after(function() {
    mongoose.disconnect();
  });



  afterEach(function() {
    clsNamespace.get("value").should.be.eql(1);
  });

  it("Model#find callback", function*() {
    yield function(callback) {
      TestModel.find({}, callback);
    };
  });

  it("Model#find promise", function*() {
    yield TestModel.find({});
  });

  it("Model#update callback", function*() {
    yield function(callback) {
      TestModel.update(
        {"nonexistent_field": "nonexistent_value"},
        {$set: {value: "modified entry"}},
        callback
      );
    };
  });

  it("Model#find promise", function*() {
    yield TestModel.update(
      {"nonexistent_field": "nonexistent_value"},
      {$set: {value: "modified entry"}}
    );
  });


  it("Model#distinct callback", function*() {
    yield function(callback) {
      TestModel.distinct('doesntExist', callback);
    };
  });
  it("Model#distinct promise", function*() {
    yield TestModel.distinct('doesntExist');
  });

  it("Model#count callback", function*() {
    yield function(callback) {
      TestModel.count({}, callback);
    };
  });

  it("Model#count promise", function*() {
    yield TestModel.count({});
  });

});

