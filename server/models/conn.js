const mongoose = require('mongoose');

var conn = mongoose.createConnection('mongodb://127.0.0.1:29001/wiki');


module.exports = conn
