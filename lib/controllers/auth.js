/*jslint browser:true */
/*jslint nomen:true */
/*global process,next,module,exports,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var auth = {}
	config = require("_/services/config");

module.exports = function () {
  "use strict";
  return auth;
};

auth.shouldAuthenticate = function(req, res, next) {
	"use strict";
	var key,
			namespace = config.get("api:rest:namespaces")[req.params.namespace];

	if (req.method === "GET") {
		if (req.params.id) {
			// get one
			key = "findOne";
		} else {
			// get list
			key = "findOne";
		}
	} else if (req.method === "POST") {
		// create
		key = "create";
	} else if (req.method === "PUT") {
		// update
		key = "update";
	} else if (req.method === "DELETE") {
		// delete
		key = "delete";
	}

	if (namespace[key] && namespace[key].auth) {
		auth.isAuthenticated(req, res, next);
	} else {
		next();
	}
}

auth.isAuthenticated = function(req, res, next) {
  "use strict";
  console.log("Auth mocked, should be implemented");
  // mock authenticated user, later change to cookie session
  next();
};












