var env = process.env.NODE_ENV || "development",
	http = require("http"),
	baseApiUrl = "/api",
	config = require("_/configs/" + env + ".json"),
	database = require("_/models/mongo") ();

http.createServer(function (req, res) {
	var url = req.url.replace(config.api.baseURL, "").replace(/^\/|\/$/g, ""),
			splitUrl = url.split("/"),
			namespace = splitUrl[0],
			id = splitUrl[1],
			method = req.method,
			headers = req.headers,
			output = {},
			namespaceConfig;

	console.log(new Date().toString() + " [" + method + "] [" + env + "] " + req.url);

	if (!config.api.namespaces[namespace]) {
		res.writeHead(404, {"application/json": "charset=utf-8"});
		res.end();
	}

	res.writeHead(200, {
		"Content-Type": "application/json; charset=utf-8"
	});

	namespaceConfig = config.api.namespaces[namespace];

	if (method === "GET") {
		if (id) {
			if (namespaceConfig.findOne.controller) {
				console.log("controller");
			} else {
				database.findOne(namespace, id, function(results) {
					output[namespaceConfig.plural] = results;
					res.end(JSON.stringify(output));
				});
			}
		} else {
			if (namespaceConfig.findAll.controller) {
				console.log("controller");
			} else {
				database.findAll(namespace, {}, 100000, function(results) {
					output[namespaceConfig.plural] = results;
					res.end(JSON.stringify(output));
				});
			}
		}
	} else if (method === "POST") {
		if (namespaceConfig.create.controller === true) {
      controller = require(__dirname + "/controllers/" + namespaces[req.params.namespace].singular) (app);
      controller.create(req, res, function(results) {
        output[namespaces[req.params.namespace].plural] = results;
        res.end(JSON.stringify(output));
      });
    } else if (create.controller === false) {
      database.create(namespace, req.body[namespaceConfig.singular], function(results) {
        output[namespaceConfig.plural] = results;
        res.end(JSON.stringify(output));
      });
    }
	} else if (method === "PUT") {
		if (namespaceConfig.update.controller === true) {
      res.end("Unused");
    } else if (update.controller === false) {
      database.update(namespace, id, req.body[namespaces[req.params.namespace].singular], function(results) {
        output[namespaceConfig.plural] = results;
        res.end(JSON.stringify(output));
      });
    }
	} else if (method === "DELETE") {
		if (namespaceConfig.delete.controller === true) {
      res.end("Unused");
    } else if (del.controller === false) {
      database.delete(namespace, req.params.id, function(results) {
        output[namespaceConfig.plural] = results;
        res.end(JSON.stringify(output));
      });
    }
	}

}).listen(3000);