var mongoose = require('mongoose');
var topicShema = require("./shems/topic.js");

var connect = require("./connect.js");
var Topic = mongoose.model("Topic", topicShema.topicShema);

exports.connect = function() {
    mongoose.connect(connect.cluster + connect.db, { useNewUrlParser: true });
};

exports.insert = function(myobj, callBack) {
    var topic = new Topic({
        title: myobj.title,
        text: myobj.text,
        createrId: myobj.createrId,
        createrLogin: myobj.createrLogin
    });
    topic.save().then(function(res) {
        console.log("1 document inserted");
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findTopic = function(topic, callBack) {
    Topic.findOne({ _id: topic }).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findTopicsByCreater = function(createrId, callBack) {
    Topic.find({ createrId: createrId }).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findTopicsByToksAndCreater = function(toks, from, to, createrId, callBack) {

    var regex = toks.join("|");

    Topic.find({
        "$and": [
            { "createrId": createrId },
            {
                "$or": [
                    { "title": { "$regex": regex } },
                    { "text": { "$regex": regex } }
                ]
            }
        ]
    }).skip(from).limit(to).then(function(res) {
        if (typeof(callBack) == "function") {
            callBack(res);
        }
    });
};

exports.findTopicsByCreaterfromTo = function(from, to, createrId, callBack) {
    Topic.find({ createrId: createrId }).skip(from).limit(to).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.AllTopics = function(callBack) {
    Topic.find().then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.fromToTopics = function(from, to, callBack) {
    Topic.find().skip(from).limit(to).then(function(res) {
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.findTopicsByToks = function(toks, from, to, callBack) {

    var regex = toks.join("|");

    Topic.find({
        "$or": [
            { "title": { "$regex": regex } },
            { "text": { "$regex": regex } }
        ]
    }).skip(from).limit(to).then(function(res) {
        if (typeof(callBack) == "function") {
            callBack(res);
        }
    });
};

exports.findTopicsByToksAndUser = function(toks, from, to, user, callBack) {

    var regex = toks.join("|");

    Topic.find({
        "$and": [
            { "createrId": user },
            {
                "$or": [
                    { "title": { "$regex": regex } },
                    { "text": { "$regex": regex } }
                ]
            }
        ]
    }).skip(from).limit(to).then(function(res) {
        if (typeof(callBack) == "function") {
            callBack(res);
        }
    });
};

exports.update = function(myobj, callBack) {

    Topic.update({
        "$and": [
            { "_id": myobj._id },
            {
                "$or": [
                    { "text": { "$ne": myobj.text } },
                    { "title": { "$ne": myobj.title } }
                ]
            }
        ]
    }, {
        "$set": {
            "text": myobj.text,
            "title": myobj.title
        }
    }).then(function(res) {
        console.log("1 document update");
        if (typeof(callBack) == "function")
            callBack(res);
    });
};

exports.remove = function(topic, callBack) {

    console.log(topic);

    Topic.remove({
        "_id": topic
    }).then(function(res) {
        console.log("1 document remove");
        if (typeof(callBack) == "function")
            callBack(res);
    });
};