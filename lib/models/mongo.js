/*jslint browser:true */
/*jslint nomen:true */
/*global module, process,EventEmitter,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var documents = {},
  env = process.env.NODE_ENV || "development",
  config = require("_/configs/" + env + ".json"),
  mongo = require("mongodb"),
  MongoClient = mongo.MongoClient,
  ObjectID = mongo.ObjectID;

module.exports = function (config) {
  "use strict";
  documents.config = config;
  return documents;
};

documents.post = function(collection, data, callback) {
  "use strict";
  var collectionObject;

  MongoClient.connect(config.mongoDb.connectString, function(error, db) {
    if (error) {
      throw error;
    }

    collectionObject = db.collection(collection);
    collectionObject.insert(data, {}, function(error, results) {
      if (error) {
        throw error;
      }
      callback(results[0]);
      db.close();
    });
  });
};

documents.getOne = function(collection, id, callback) {
  "use strict";
  var collectionObject;

  MongoClient.connect(config.mongoDb.connectString, function(error, db) {
    var mongoId = new ObjectID(id);

    if (error) {
      throw error;
    }

    collectionObject = db.collection(collection);
    collectionObject
      .findOne({_id: mongoId}, function(error, results) {
        callback(results);
        db.close();
      });
  });
};

documents.get = function(collection, query, limit, callback) {
  "use strict";
  var collectionObject;

  MongoClient.connect(config.mongoDb.connectString, function(error, db) {
    if (error) {
      throw error;
    }

    collectionObject = db.collection(collection);
    collectionObject
      .find(query)
      .toArray(function(err, results) {
        callback(results);
        db.close();
    });
  });
};

documents.put = function(collection, id, data, callback) {
  "use strict";
  var collectionObject,
    mongoId = new ObjectID(id);

  MongoClient.connect(config.mongoDb.connectString, function(error, db) {
    if (error) {
      throw error;
    }

    collectionObject = db.collection(collection);
    collectionObject.update({_id: mongoId}, {$set: data}, {}, function(error, results) {
      if (error) {
        throw error;
      }
      callback(results);
      db.close();
    });
  });


};

documents.delete = function(collection, id, callback) {
  "use strict";
  "use strict";
  var collectionObject,
    mongoId = new ObjectID(id);

  MongoClient.connect(config.mongoDb.connectString, function(error, db) {
    if (error) {
      throw error;
    }

    collectionObject = db.collection(collection);
    collectionObject.findAndModify({_id: mongoId}, {}, {}, {remove: true}, function(error, results) {
      if (error) {
        throw error;
      }
      callback(results);
      db.close();
    });
  });
};