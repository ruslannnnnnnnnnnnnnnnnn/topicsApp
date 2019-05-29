var topicsDb = require("../database/topicsdb");
var usersDb = require("../database/userdb");
var sessionDb = require("../database/sessiondb");
var isAuthenticated = require("./common").isAuthenticated,
    isCreaterUser = require("./common").isCreaterUser,
    isCreaterTopic = require("./common").isCreaterTopic;

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
                        },
                        function(resul) {
                            req.session.authId = resul._id;
                            req.session.login = resul.login;
                            res.send({ isRegister: true });
                        });
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
            usersDb.findLogin(req.body.login, (resul) => res.send(resul));
        else if (req.body.email != null)
            usersDb.findEmail(req.body.email, (resul) => res.send(resul));
        else if (req.session != null)
            usersDb.findUser(req.session.authId, (resul) => res.send(resul));
    }
]