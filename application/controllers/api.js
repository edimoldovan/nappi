/*jslint node:true */
/*jslint nomen:true */
/*global Handlebars,Layout,module,exports,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var url = require("url"),
  controller = {},
  id,
  namespaces = {
    locations: {
      singular: "location",
      plural: "locations",
      controller: {
        post: true,
        put: false,
        get: true,
        delete: false
      }
    }
  };

module.exports = function(app) {
  "use strict";
  app.documents = require("../../application/models/documents") (app);
  controller.app = app;
  return controller;
};

controller.get = function(req, res) {
  "use strict";
  var parsedUrl = url.parse(req.url, true),
    urlArray = parsedUrl.pathname.replace(/^\/|\/$/g, "").split("/"),
    namespaceIndex = urlArray[1],
    output = {},
    query = parsedUrl.query,
    limit = {},
    handler;


  if (namespaces[namespaceIndex].controller.get) {
    handler = require("../../application/controllers/" + namespaces[namespaceIndex].singular) (controller.app);
  } else {
    handler = controller.app.documents;
  }

  if (urlArray.length > 2) {
    id = urlArray[2];
    handler.findOne(namespaces[namespaceIndex].plural, id, function(result) {
      if (result) {
        output[namespaces[namespaceIndex].plural] = result;
      } else {
        output[namespaces[namespaceIndex].plural] = {};
      }
      res.end(JSON.stringify(output));
    });
  } else {
    handler.findAll(namespaces[namespaceIndex].plural, query, limit, function(results) {
      output[namespaces[namespaceIndex].plural] = results;
      res.end(JSON.stringify(output));
    });
  }
}

controller.post = function(req, res) {
  "use strict";
  var urlArray = req.url.replace(/^\/|\/$/g, "").split("/"),
    namespaceIndex = urlArray[1],
    output = {},
    handler;

  if (namespaces[namespaceIndex].controller.post) {
    handler = require("../../application/controllers/" + namespaces[namespaceIndex].singular) (controller.app);
  } else {
    handler = controller.app.documents;
  }

  handler.create(namespaces[namespaceIndex].plural, req.body, function(result) {
    output[namespaces[namespaceIndex].singular] = result;
    res.end(JSON.stringify(output));
  });
  
}

controller.put = function(req, res) {
  "use strict";
  var urlArray = req.url.replace(/^\/|\/$/g, "").split("/"),
    namespaceIndex = urlArray[1],
    id = req.params[0].split("/")[1],
    output = {},
    handler;

  if (namespaces[namespaceIndex].controller.post) {
    handler = require("../../application/controllers/" + namespaces[namespaceIndex].singular) (controller.app);
  } else {
    handler = controller.app.documents;
  }

  handler.update(namespaces[namespaceIndex].plural, id, req.body, function(result) {
    output.meta = {}
    output.meta[namespaces[namespaceIndex].singular] = result;
    res.end(JSON.stringify(output));
  });
}

controller.delete = function(req, res) {
  "use strict";
  var urlArray = req.url.replace(/^\/|\/$/g, "").split("/"),
    namespaceIndex = urlArray[1],
    id = req.params[0].split("/")[1],
    output = {},
    handler;

  if (namespaces[namespaceIndex].controller.post) {
    handler = require("../../application/controllers/" + namespaces[namespaceIndex].singular) (controller.app);
  } else {
    handler = controller.app.documents;
  }

  handler.delete(namespaces[namespaceIndex].plural, id, function(result) {
    res.end(JSON.stringify(output));
  });
}











