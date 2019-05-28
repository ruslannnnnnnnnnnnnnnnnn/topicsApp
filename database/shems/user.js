var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.userShema = new Schema({
    password: String,
    email: String,
    login: String,
    age: String,
    name: String,
    aboutMe: String,
    image: String
});