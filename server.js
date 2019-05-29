var express = require("express");
var hendlers = [require("./hendlers/commonHendlers"), require("./hendlers/topicsHendler"), require("./hendlers/usersHendler")];
var bodyParser = require("body-parser");
var multer = require("multer");
var mongoose = require("mongoose");

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var connect = require("./database/connect.js");

var upload = multer();
var app = express();

mongoose.connect(connect.cluster + connect.db, { useNewUrlParser: true });

app.use(session({
    secret: 'i need more beers',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(bodyParser.json());

for (var i = 0; i < hendlers.length; i++) {
    for (var hendler in hendlers[i]) {
        if (typeof hendlers[i][hendler] === "function" ||
            Array.isArray(hendlers[i][hendler]) && hendlers[i][hendler].every((item) => typeof item == "function")) {
            app.all('/' + hendler, ...[upload.array()].concat(hendlers[i][hendler]));
        }
    }
}

app.listen(process.env.PORT || 8080);