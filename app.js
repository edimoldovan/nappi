/*jslint browser:true */
/*jslint nomen:true */
/*global process,EventEmitter,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var env = process.env.NODE_ENV || "development",

  mongo = require("mongodb"),
  MongoClient = mongo.MongoClient,

  express = require("express"),
  sessions = require("client-sessions"),
  config = require("application/services/config"),
  morgan = require("morgan"),
  bcrypt = require("bcrypt-nodejs"),
  bodyParser = require("body-parser"),
  consolidate = require("consolidate"),
  sass = require("node-sass"),
  minify = require("express-minify"),

  documents = require("application/models/documents") (),

  app = express(),
  basedir = __dirname + "/config";

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

app.set("view engine", "handlebars");
app.engine("handlebars", consolidate.handlebars);
app.set("views", __dirname + "/application/");

if (env === "development") {

  app.use(morgan(config.get("morgan:format"), {
      immediate: true
    })
  );

  app.use(sass.middleware({
      src: __dirname,
      dest: __dirname,
      outputStyle: "compressed",
      debug: true
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

config.get("static").forEach(function(folder) {
  app.use(folder, express["static"](__dirname + folder));
});

app.use(bodyParser.json(config.get("json")));
app.use(bodyParser.urlencoded(config.get("urlencoded")));

require(__dirname + config.get("routes:src")) (app);

try {
  app.listen(config.get("app:port"));
  console.log("App listening on port " + config.get("app:port"));
} catch(e) {
  console.log(e);
}