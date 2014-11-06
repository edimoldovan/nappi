/*jslint browser:true */
/*jslint nomen:true */
/*global process,∆next,module,exports,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

module.exports = function(app) {
  "use strict";
  var config = require("_/services/config"),
    auth = require("_/controllers/auth") (),
    database = require("_/models/mongo") (),

    namespaces = config.get("api:rest:namespaces");

  app.all(config.get("api:rest:baseURL") + "/*", function(req, res, next) {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
  });

  app.get(config.get("api:rest:baseURL") + "/:namespace", auth.shouldAuthenticate, function(req, res, next) {
    var controller,
      output = {},
      findAll = namespaces[req.params.namespace].findAll;

    if (findAll === undefined) {
      res.sendStatus(404);
    } else if (findAll.controller === true) {
      controller = require(__dirname + "/controllers/" + namespaces[req.params.namespace].singular) (app);
      controller.findAll(req, res, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    } else if (findAll.controller === false) {
      database.findAll(req.params.namespace, {}, 100000, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.get(config.get("api:rest:baseURL") + "/:namespace/:id", auth.shouldAuthenticate, function(req, res, next) {
    var controller,
      output = {},
      findOne = namespaces[req.params.namespace].findOne;

    if (findOne === undefined) {
      res.sendStatus(404);
    } else if (findOne.controller === true) {
      controller = require(__dirname + "/controllers/" + namespaces[req.params.namespace].singular) (app);
      controller.findAll(req, res, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    } else if (findOne.controller === false) {
      database.findOne(req.params.namespace, req.params.id, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.post(config.get("api:rest:baseURL") + "/:namespace", auth.shouldAuthenticate, function(req, res, next) {
    var controller,
      output = {},
      create = namespaces[req.params.namespace].create;

    if (create === undefined) {
      res.sendStatus(404);
    } else if (create.controller === true) {
      controller = require(__dirname + "/controllers/" + namespaces[req.params.namespace].singular) (app);
      controller.create(req, res, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    } else if (create.controller === false) {
      database.create(req.params.namespace, req.body[namespaces[req.params.namespace].singular], function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.put(config.get("api:rest:baseURL") + "/:namespace/:id", auth.shouldAuthenticate, function(req, res, next) {
    var controller,
      output = {},
      update = namespaces[req.params.namespace].update;

    if (update === undefined) {
      res.sendStatus(404);
    } else if (update.controller === true) {
      res.end("Unused");
    } else if (update.controller === false) {
      database.update(req.params.namespace, req.params.id, req.body[namespaces[req.params.namespace].singular], function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.delete(config.get("api:rest:baseURL") + "/:namespace/:id", auth.shouldAuthenticate, function(req, res, next) {
    var controller,
      output = {},
      del = namespaces[req.params.namespace].delete;

    if (del === undefined) {
      res.sendStatus(404);
    } else if (del.controller === true) {
      res.end("Unused");
    } else if (del.controller === false) {
      database.delete(req.params.namespace, req.params.id, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    }
  });

  app.get("", function(req, res) {
    res.sendStatus(404);
  });

};









