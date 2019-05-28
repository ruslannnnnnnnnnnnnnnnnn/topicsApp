var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

exports.sessions = function(callBack) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("mydb");

        dbo.collection("sessions").find().toArray(function(err, res) {
            if (err) throw err;

            if (typeof(callBack) == "function")
                callBack(res);

            db.close();
        });
    });
};

exports.session = function(session, callBack) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("mydb");

        dbo.collection("sessions").findOne({ _id: session.id }, function(err, res) {
            if (err) throw err;

            if (typeof(callBack) == "function") {
                if (res != null) {
                    var resSess = JSON.parse(res.session);
                    if (resSess.authId == session.authId && resSess.login == session.login) {
                        callBack(res);
                        db.close();
                        return;
                    }
                }
                callBack(null);
            }

            db.close();
        });
    });
};

exports.remove = function(sessionId, callBack) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("mydb");

        dbo.collection("sessions").remove({ _id: sessionId }, function(err, res) {
            if (err) throw err;

            if (typeof(callBack) == "function")
                callBack(res);

            db.close();
        });
    });
};