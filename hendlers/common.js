exports.isAuthenticated = function(req, res, next) {
    sessionDb.session(req.session, function(resul) {
        if (resul != null && typeof(next) == "function") {
            next();
        } else {
            res.send({ isAuth: false });
        }
    });
}

exports.isCreaterTopic = function(req, res, next) {
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

exports.isCreaterUser = function(req, res, next) {
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