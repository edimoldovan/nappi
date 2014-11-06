/*jslint browser:true */
/*jslint nomen:true */
/*global process,EventEmitter,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var env = process.env.NODE_ENV || "development",

  mongo = require("mongodb"),
  MongoClient = mongo.MongoClient,
  express = require("express"),
  sessions = require("client-sessions"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  consolidate = require("consolidate"),

  config = require("_/services/config"),

  app = express();

MongoClient.connect(config.get("mongoDb:connectString"), function(error, db) {
  if (error) {
    throw error;
  }

  config.get("mongoDb:indexes").forEach(function(index) {
    collection = db.collection(index.collection);

    if (index.expireAfterSeconds) {
      collection.ensureIndex(index.index, {expireAfterSeconds: index.expireAfterSeconds},function(ensureError) {
        if (ensureError) {
          throw ensureError;
        }
      });
    } else {
      collection.ensureIndex(index.index, function(ensureError) {
        if (ensureError) {
          throw ensureError;
        }
      });
    }
  });
});

if (env === "development") {

  app.use(morgan(config.get("morgan:format"), {
      immediate: true
    })
  );

}

app.use(sessions({
  cookieName: config.get("session:cookieName"),
  secret: config.get("session:secret"),
  duration: config.get("session:duration"),
  cookie: {
    path: config.get("session:cookie:path"),
    ephemeral: config.get("session:cookie:ephemeral"),
    httpOnly: config.get("session:cookie:httpOnly")
  }
}));

app.use(bodyParser.json(config.get("json")));
app.use(bodyParser.urlencoded(config.get("urlencoded")));

require(config.get("routes:src")) (app);

try {
  app.listen(config.get("app:port"));
  console.log("App listening on port " + config.get("app:port"));
} catch(e) {
  console.log(e);
}
