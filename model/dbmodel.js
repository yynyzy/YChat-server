var mongoose = require('mongoose');

const db = require('../config/db')

var Schema = mongoose.Schema

var SchemaUser = new Schema()

module.exports = db.model('User', SchemaUser)