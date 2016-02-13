
const mongoose = require('mongoose');

mongoose.set('debug', true);

mongoose.Promise = Promise;


mongoose.model('test_model', mongoose.Schema({value: String}));


module.exports = mongoose;
