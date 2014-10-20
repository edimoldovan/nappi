/*jslint browser:true */
/*jslint nomen:true */
/*global module, process,EventEmitter,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var env = process.env.NODE_ENV || "development",
  config = require("nconf").argv().env().file({file: __dirname + "/../../config/" + env + ".json"});

module.exports = config;