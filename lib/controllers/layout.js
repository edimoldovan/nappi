/*jslint node:true */
/*jslint nomen:true */
/*global passport,process,Handlebars,Layout,module,exports,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var controller = {};

module.exports = function() {
  "use strict";
  return controller;
};

controller.render = function(req, res) {
  "use strict";
  var handlebars = require("handlebars"),
    env = process.env.NODE_ENV || "development",
    config = require("_/services/config"),
    fs = require("fs"),
    output = "",
    currentLayout,
    currentUser = {},
    url = req.url.replace(/^\/|\/$/g, ""),
    urlArray = url.split("/"),
    settings = config.get("public");

  if (url === "") {
    url = "index";
  }

  if (req.user) {
    currentUser = req.user;
    currentUser.password = null;
  }

  res.set({
    "Content-Type": "text/html; charset=utf-8"
  });

  output += handlebars.compile(fs.readFileSync(__dirname + "/../views/site-header.hbs", "utf8"))({
    title: settings.title,
    domain: settings.domain,
    api: config.api,
    stylesheets: settings.stylesheets,
    user: currentUser
  });

  currentLayout = settings.layouts.filter(function(layout) {
    if (layout.url === url) {
      layout.templates.forEach(function(template) {
        if (template.type = "include") {
          output += fs.readFileSync(__dirname + "/../views/" + template.name + ".hbs", "utf8");
        } else {
          output += handlebars.compile(fs.readFileSync(__dirname + "/../views/" + template.name + ".hbs", "utf8"))({
            user: currentUser,
            domain: settings.domain
          });
        }
      });
    }
  })[0];

  output += handlebars.compile(fs.readFileSync(__dirname + "/../views/site-footer.hbs", "utf8"))({
    javascripts: settings.javascripts,
    domain: settings.domain,
    user: currentUser
  });

  res.end(output);
};





















