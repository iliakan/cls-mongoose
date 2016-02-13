'use strict';

const cls = require('continuation-local-storage');
const clsNamespace = cls.createNamespace('app');

const mongoose = require('./mongoose');

//let clsMongoose = require('..');
//clsMongoose(clsNamespace);

function getMongooseVersion() {
  let fs = require('fs');
  let file = 'node_modules/mongoose/package.json';
  file = fs.readFileSync(file, 'utf8');
  let json = JSON.parse(file);
  let version = json.version;
  return (version);
}

describe("mongoose with cls", function() {

  let mongooseVersion = getMongooseVersion();

  let TestModel = mongoose.model('test_model');

  before(function(done) {

    let context = clsNamespace.createContext();
    clsNamespace.enter(context);

    mongoose.connect('mongodb://localhost/mongoose-cls-test', done);
  });

  after(function() {
    mongoose.disconnect();
  });


  describe("when single thread", function() {
    beforeEach(function() {
      this.value = Math.random();
      clsNamespace.set("value", this.value);
    });

    afterEach(function() {
      clsNamespace.get("value").should.be.eql(this.value);
    });

    it("Model#find callback", function(done) {
      TestModel.find({}, done);
    });

    it("Model#find promise", function(done) {
      TestModel.find().then(done.bind(null, null), done);
    });

    it("Model#findOne callback", function(done) {
      TestModel.findOne({}, done);
    });

    it("Model#findOne promise", function(done) {
      TestModel.findOne({}).then(done.bind(null, null), done);
    });

    it("Model#update callback", function(done) {
      TestModel.update(
        {"nonexistent_field": "nonexistent_value"},
        {$set: {value: "modified entry"}},
        done
      );
    });

    it("Model#find promise", function(done) {
      TestModel.update(
        {"nonexistent_field": "nonexistent_value"},
        {$set: {value: "modified entry"}}
      ).then(done.bind(null, null), done);
    });


    it("Model#distinct callback", function(done) {
      TestModel.distinct('doesntExist', done);
    });
    it("Model#distinct promise", function(done) {
      TestModel.distinct('doesntExist').then(done.bind(null, null), done);
    });

    it("Model#count callback", function(done) {
      TestModel.count({}, done);
    });

    it("Model#count promise", function(done) {
      TestModel.count({}).then(done.bind(null, null), done);
    });


    it("Model#aggregate callback", function(done) {
      TestModel.aggregate({$match: {"nonexistent_field": "nonexistent_value"}}, done);
    });

    it("Model#aggregate promise", function(done) {
      TestModel.aggregate({$match: {"nonexistent_field": "nonexistent_value"}}).exec()
        .then(done.bind(null, null), done);
    });

  });

  describe("when parallel queries", function() {

    let poolSize = 5;
    it("Model#find callback", function(done) {

      let values = [];
      for(let i=0; i<poolSize; i++) {
        values.push(Math.random());
        clsNamespace.set("value" + i, values[i]);
      }

      let count = 0;
      function cb() {
        for(let i=0; i<poolSize; i++) {
          clsNamespace.get("value" + i).should.eql(values[i]);
        }
        count++;
        if (count == poolSize) done();
      }

      for(let i=0; i<poolSize; i++) {
        TestModel.find({}, cb);
      }


    });

  });


});
