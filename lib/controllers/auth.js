/*jslint browser:true */
/*jslint nomen:true */
/*global process,next,module,exports,__dirname,require,$,console,cookie,alert,Ember,jQuery,FileReader,canvas,FB*/

var auth = {};

module.exports = function () {
  "use strict";
  return auth;
};

auth.isAuthenticated = function (req, res, next) {
  "use strict";
  // mock authenticated user, later change to cookie session
  next();
};












