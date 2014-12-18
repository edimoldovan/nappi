// curl -X POST -H "Content-Type: application/json; charset=utf-8" "localhost:3000/users" -d "{'user':{'email':'pistike@pistike.hu'}}"

/*jslint browser:true */
/*jslint nomen:true */
/*global module, process,EventEmitter,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var env = process.env.NODE_ENV || "development",
  http = require("http"),
  url = require("url"),
  config = require("_/configs/" + env + ".json"),
  database = require("_/models/mongo") ();

function setHeaders(res) {
  res.writeHead(200, 
    {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    }
  );
}

function write404(res) {
  "use strict";
  res.writeHead(404, {"Content-Type": "application/json; charset=utf-8"});
  res.end();
}

http.createServer(function (req, res) {
  "use strict";
  var parsedUrl = url.parse(req.url, true),
      splitUrl = parsedUrl.pathname.replace(/^\/|\/$/g, "").split("/"),
      namespace = splitUrl[0],
      id = splitUrl[1],
      output = {},
      method = req.method.toLowerCase(),
      namespaceConfig,
      applyParams = [],
      handler,
      body = "";

  console.log(new Date().toString() + " [" + method + "] [" + env + "] " + req.url);

  function handleResults(results) {
    output[namespaceConfig.plural] = results;
    res.end(JSON.stringify(output));
  }

  if (!config.api.namespaces[namespace] || !namespace) {
    return write404(res);
  }

  namespaceConfig = config.api.namespaces[namespace];

  if (!namespaceConfig[method] && method !== "options") {
    write404(res);
  }

  applyParams.push(namespace);
  // enable CORS
  setHeaders(res);

  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function () {
    if (method === "options") {
      res.end();
    } else if (method === "get") {
      handler = database;
      if (id) {
        method = "getOne";
        applyParams.push(id);
      } else {
        applyParams.push({});
        applyParams.push(100000);
      }
    } else if (method === "post") {
      applyParams.push(JSON.parse(body)[namespaceConfig.singular]);
    } else if (method === "put") {
      applyParams.push(id);
      applyParams.push(JSON.parse(body)[namespaceConfig.singular]);
    } else if (method === "delete") {
      applyParams.push(id);
    }

    if (method !== "options") {
      if (namespaceConfig[method].controller) {
        // handler = controller;
        console.log("controller");
      } else {
        handler = database;
      }

      applyParams.push(handleResults);
      handler[method].apply(this, applyParams);
    }
  });

}).listen(3000);














