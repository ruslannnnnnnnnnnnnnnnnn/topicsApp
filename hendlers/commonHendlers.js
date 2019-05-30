var topicsDb = require("../database/topicsdb");
var usersDb = require("../database/userdb");
var sessionDb = require("../database/sessiondb");

var isAuthenticated = require("./common").isAuthenticated,
    isCreaterUser = require("./common").isCreaterUser,
    isCreaterTopic = require("./common").isCreaterTopic;

function index(req, response) {
    response.sendfile("./index.html");
}

exports[""] = index;
exports.index = index;

exports.isCreaterUser = function(req, res) {
    isCreaterUser(req, res, null);
}

exports.isAuthenticated = function(req, res) {
    isAuthenticated(req, res, () => res.send({ isAuth: true }));
}

exports.isCreaterTopic = function(req, res) {
    isCreaterTopic(req, res, () => res.send({ isCreater: true }));
}