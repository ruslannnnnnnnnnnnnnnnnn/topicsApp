var express = require("express");
var hendlers = require("./hendlers");
var bodyParser = require("body-parser");
var multer = require("multer");
var mongoose = require("mongoose");

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var upload = multer();
var app = express();

app.use(session({
    secret: 'i need more beers',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: 'mongodb://localhost:27017/mydb',
    })
}));

app.use(bodyParser.json());

for (var hendler in hendlers) {
    if (typeof hendlers[hendler] === "function" ||
        Array.isArray(hendlers[hendler]) && hendlers[hendler].every((item) => typeof item == "function")) {
        app.all('/' + hendler, ...[upload.array()].concat(hendlers[hendler]));
    }
}

app.listen(8080);