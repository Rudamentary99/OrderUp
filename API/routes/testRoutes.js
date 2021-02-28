var indexRouter = require("./index");
var usersRouter = require("./users");
var r = require("rethinkdb");
/**
 * The list of routes for testing
 */
module.exports = [
  {
    method: "use",
    path: "/",
    fn: indexRouter,
  },
  {
    method: "use",
    path: "users",
    fn: usersRouter,
  },
  {
    method: "all",
    path: "/api/testBody",
    fn: (req, res, next) => {
      try {
        res.send(req.body);
      } catch (error) {
        next(error);
      }
    },
  },
  {
    method: "all",
    path: "/api/testParams",
    fn: (req, res) => {
      res.send(req.params);
    },
  },
];
