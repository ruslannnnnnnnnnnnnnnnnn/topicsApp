var mongoose = require('mongoose');
var topicShema = require("./shems/topic.js");

var connect = require("./connect.js");
var Topic = mongoose.model("Topic", topicShema.topicShema);


mongoose.connect(connect.cluster + connect.db, { useNewUrlParser: true });

var topic = new Topic({
    title: "hello1"
});
topic.save().then(function(res) {
    console.log("1 document inserted");
});