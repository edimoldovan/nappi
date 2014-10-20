/*jslint browser:true */
/*jslint nomen:true */
/*global process,∆next,module,exports,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

module.exports = function(app) {
  "use strict";
  var config = require("nconf"),
    layout = require("./controllers/layout") (app),
    githubController = require("./controllers/github") (app),
    auth = require("./controllers/auth") (app),
    documents = require("./models/documents") (),

    namespaces = {
      users: {
        singular: "user",
        plural: "users",
        controller: {
          create: false,
          update: false,
          findOne: false,
          findAll: false,
          delete: false
        }
      }
    };

  app.all(config.get("api:rest:baseURL") + "/*", auth.isAuthenticated, function(req, res, next) {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
  });

  app.get(config.get("api:rest:baseURL") + "/:namespace", auth.isAuthenticated, function(req, res, next) {
    var controller,
      output = {};

    if (namespaces[req.params.namespace].controller.findAll) {
      controller = require(__dirname + "/controllers/" + namespaces[req.params.namespace].singular) (app);
      controller.findAll(req, res, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    } else {
      documents.findAll(req.params.namespace, {}, 100000, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.get(config.get("api:rest:baseURL") + "/:namespace/:id", auth.isAuthenticated, function(req, res, next) {
    var controller,
      output = {};

    if (namespaces[req.params.namespace].controller.findOne) {
      controller = require(__dirname + "/controllers/" + namespaces[req.params.namespace].singular) (app);
      controller.findAll(req, res, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    } else {
      documents.findOne(req.params.namespace, req.params.id, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.post(config.get("api:rest:baseURL") + "/:namespace", auth.isAuthenticated, function(req, res, next) {
    var controller,
      output = {};

    if (namespaces[req.params.namespace].controller.create) {
      controller = require(__dirname + "/controllers/" + namespaces[req.params.namespace].singular) (app);
      controller.create(req, res, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    } else {
      documents.create(req.params.namespace, req.body[namespaces[req.params.namespace].singular], function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.put(config.get("api:rest:baseURL") + "/:namespace/:id", auth.isAuthenticated, function(req, res, next) {
    var controller,
      output = {};

    if (namespaces[req.params.namespace].controller.create) {
      res.end("Unused");
    } else {
      documents.update(req.params.namespace, req.params.id, req.body[namespaces[req.params.namespace].singular], function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.delete(config.get("api:rest:baseURL") + "/:namespace/:id", auth.isAuthenticated, function(req, res, next) {
    var controller,
      output = {};

    if (namespaces[req.params.namespace].controller.create) {
      res.end("Unused");
    } else {
      documents.delete(req.params.namespace, req.params.id, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.post("/_github-webhook/", function(req, res) {
    githubController.pull(req, res);
  });

  app.get("*", function(req, res) {
    layout.render(req, res);
  });

};









