var topicsDb = require("./database/topicsdb");
var usersDb = require("./database/userdb");
var sessionDb = require("./database/sessiondb");



function index(req, response) {
    response.sendfile("index.html");
}

function hello(req, response) {
    response.send("Hello");
}

exports[""] = index;
exports.index = index;
exports.hello = hello;

topicsDb.connect();

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

exports.insertUser = function(req, res) {
    usersDb.findEmail(req.body.email, function(resul) {
        if (resul == null) {
            usersDb.findLogin(req.body.login, function(resul) {
                if (resul == null) {
                    usersDb.insert({
                        password: req.body.password,
                        email: req.body.email,
                        login: req.body.login,
                        age: req.body.age,
                        name: req.body.name
                    }, (resul) => res.send({ isRegister: true }));
                    console.log("register save");
                } else
                    res.send({ isLogin: true });
            });
        } else {
            res.send({ isEmail: true });
        }
    });
}

exports.updateUser = [
    isCreaterUser,
    function(req, res) {
        var obj = { aboutMe: req.body.aboutMe, age: req.body.age, name: req.body.name, image: req.body.image };

        if (req.body._id != null)
            obj.user = { _id: req.body._id };
        else if (req.body.email != null)
            obj.user = { email: req.body.email };
        else if (req.body.login != null)
            obj.user = { login: req.body.login };
        else if (req.session != null)
            obj.user = { _id: req.session.authId };

        usersDb.update(obj, (resul) => res.send(resul));
    }
]

exports.login = function(req, res) {
    usersDb.findEmail(req.body.email, function(resul) {
        if (resul != null && resul.password == req.body.password) {
            req.session.authId = resul._id;
            req.session.login = resul.login;
            res.send({ isRegister: true });
        } else {
            res.send({ wrong: true });
        }
    });
}

exports.logout = [
    isAuthenticated,
    function(req, res) {
        sessionDb.remove(req.session.id);
        res.send({ isAuth: true });
    }
]

exports.findUser = [
    function(req, res) {
        if (req.body._id != null)
            usersDb.findUser(req.body._id, (resul) => res.send(resul));
        else if (req.body.login != null)
            usersDb.findlogin(req.body.login, (resul) => res.send(resul));
        else if (req.body.email != null)
            usersDb.findEmail(req.body.email, (resul) => res.send(resul));
        else if (req.session != null)
            usersDb.findUser(req.session.authId, (resul) => res.send(resul));
    }
]

function isAuthenticated(req, res, next) {
    sessionDb.session(req.session, function(resul) {
        if (resul != null && typeof(next) == "function") {
            next();
        } else {
            res.send({ isAuth: false });
        }
    });
}

function isCreaterTopic(req, res, next) {
    isAuthenticated(req, res, () => {
        topicsDb.findTopic(req.body._id, function(resul) {
            if (resul != null && req.session.authId == resul.createrId && typeof(next) == "function") {
                next();
            } else {
                res.send({ isCreater: false });
            }
        });
    });
}

function isCreaterUser(req, res, next) {
    isAuthenticated(req, res, () => {
        var callBack = function(resul) {
            if (resul != null && req.session.authId == resul._id) {
                if (typeof(next) == "function")
                    next();
                else {
                    res.send({ isCreater: true, user: resul });
                }
            } else {
                res.send({ isCreater: false, user: resul });
            }
        };

        if (req.body._id != null)
            usersDb.findUser(req.body._id, callBack);
        else if (req.body.login != null)
            usersDb.findLogin(req.body.login, callBack);
        else if (req.body.email != null)
            usersDb.findEmail(req.body.email, callBack);
        else if (req.session != null)
            usersDb.findUser(req.session.authId, callBack);
    });
}

exports.isCreaterUser = function(req, res) {
    isCreaterUser(req, res, null);
}

exports.isAuthenticated = function(req, res) {
    isAuthenticated(req, res, () => res.send({ isAuth: true }));
}