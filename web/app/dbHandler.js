var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

NSReferenceProvider = function(host, port) {
    this.db = new Db('masters', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
    this.db.open(function(){});
};

//Gets the collection from the database
NSReferenceProvider.prototype.getCollection = function(query, callback) {
    this.db.collection('NSR', function(error, nsr_collection){
        if( error ) callback(error);
        else callback(null, nsr_collection);
    });
};

//Main retrieval function, takes a JSON object query.
NSReferenceProvider.prototype.findStuff = function(query, limit, callback) {
    this.getCollection(query, function(error, nsr_collection) {
        if( error ) callback(error);
        else {
            nsr_collection.find(query).limit(limit).toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};


exports.NSReferenceProvider = NSReferenceProvider; 
