var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/*
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { title: "title", text: "text", topic: "4" };
    dbo.collection("topics").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});
*/

function find(topic) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("mydb");

        dbo.collection("topics").findOne({ topic: topic }, function(err, res) {
            if (err) throw err;
            console.log(res);
            db.close();
        });
    });
};

find(4);
/*

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("topics").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

*/