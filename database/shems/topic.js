var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.topicShema = new Schema({
    title: String,
    text: String,
    createrId: String,
    createrLogin: String
});