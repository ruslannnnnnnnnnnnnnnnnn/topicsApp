var mongoose = require('mongoose');
var userShema = require("./shems/user.js");

var User = mongoose.model("User", userShema.userShema);


exports.connect = function() {
    mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });
};

exports.insert = function(myobj, callBack) {
    var user = new User({
        password: myobj.password,
        email: myobj.email,
        login: myobj.login,
        age: myobj.age,
        name: myobj.name
    });
    user.save().then(function(res) {
        console.log("1 document inserted");
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.update = function(myobj, callBack) {
    User.update({
        "$and": [
            myobj.user,
            {
                "$or": [
                    { "aboutMe": { "$ne": myobj.aboutMe } },
                    { "age": { "$ne": myobj.age } },
                    { "name": { "$ne": myobj.name } },
                    { "image": { "$ne": myobj.image } }
                ]
            }
        ]
    }, {
        "$set": {
            "aboutMe": myobj.aboutMe,
            "age": myobj.age,
            "name": myobj.name,
            "image": myobj.image
        }
    }).then(function(res) {
        console.log("1 document update");
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findUser = function(user, callBack) {
    User.findOne({ _id: user }).then(function(res) {
        console.log(res);
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findLogin = function(login, callBack) {
    User.findOne({ login: login }).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findEmailLogin = function(email, login, callBack) {
    User.findOne({
        "$or": [
            { "email": email },
            { "login": login }
        ]
    }).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findEmail = function(email, callBack) {
    User.findOne({ "email": email }).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findLogin = function(login, callBack) {
    User.findOne({ "login": login }).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.remove = function(user, callBack) {

    User.remove({
        "_id": user
    }).then(function(res) {
        console.log("1 document remove");
        if (typeof(callBack) == "function")
            callBack(res);
    });
};