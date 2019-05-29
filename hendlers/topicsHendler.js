var topicsDb = require("../database/topicsdb");
var usersDb = require("../database/userdb");
var sessionDb = require("../database/sessiondb");
var isAuthenticated = require("./common").isAuthenticated,
    isCreaterUser = require("./common").isCreaterUser,
    isCreaterTopic = require("./common").isCreaterTopic;

exports.find = function(req, res) {
    if (req.body._id != null) {
        topicsDb.findTopic(req.body._id, (resul) => res.send(resul));

    } else if (req.body.for != null && req.body.to != null) {

        if (req.body["tok-0"] == null) {
            topicsDb.fromToTopics(Number(req.body.for), Number(req.body.to), (resul) => res.send(resul));
        } else {
            var toks = [];
            for (var i = 0; req.body["tok-" + i] != null; i++) {
                toks[i] = req.body["tok-" + i];
            }
            topicsDb.findTopicsByToks(toks, Number(req.body.for), Number(req.body.to), (resul) => res.send(resul));
        }
    } else {
        topicsDb.AllTopics((resul) => res.send(resul));
    }
};

exports.findMyTopics = [
    isAuthenticated,
    function(req, res) {
        if (req.body["tok-0"] == null) {
            topicsDb.findTopicsByCreaterfromTo(Number(req.body.for), Number(req.body.to),
                req.session.authId, (resul) => res.send(resul));
        } else {
            var toks = [];
            for (var i = 0; req.body["tok-" + i] != null; i++) {
                toks[i] = req.body["tok-" + i];
            }
            topicsDb.findTopicsByToksAndCreater(toks, Number(req.body.for), Number(req.body.to),
                req.session.authId, (resul) => res.send(resul));
        }
    }
]

exports.findCreaterTopics = function(req, res) {
    if (req.body["tok-0"] == null) {
        topicsDb.findTopicsByCreaterfromTo(Number(req.body.for), Number(req.body.to),
            req.body.createrId, (resul) => res.send(resul));
    } else {
        var toks = [];
        for (var i = 0; req.body["tok-" + i] != null; i++) {
            toks[i] = req.body["tok-" + i];
        }
        topicsDb.findTopicsByToksAndCreater(toks, Number(req.body.for), Number(req.body.to),
            req.body.createrId, (resul) => res.send(resul));
    }
}

exports.insertTopic = [
    isAuthenticated,
    function(req, res) {
        topicsDb.insert({
            title: req.body.title,
            text: req.body.text,
            createrId: req.session.authId,
            createrLogin: req.session.login
        }, (resul) => res.send(resul));
    }
]

exports.updateTopic = [
    isCreaterTopic,
    function(req, res) {
        topicsDb.update({ title: req.body.title, text: req.body.text, _id: req.body._id }, (resul) => res.send(resul));
    }
]

exports.removeTopic = [
    isCreaterTopic,
    function(req, res) {
        topicsDb.remove(req.body._id, (resul) => res.send(resul));
    }
]