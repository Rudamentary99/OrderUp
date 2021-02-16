var async = require("async");
const fs = require("fs");
var r = require("rethinkdb");
const testRoutes = require("./routes/testRoutes");

//get App Config
const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));

//get express app
var app = require("./expressApp")([
  ...testRoutes,
  {
    method: "post",
    path: "/api/floor/create",
    fn: (req, res, next) => {
      r.table("floor")
        .insert(req.body)
        .run(app._rdbConn, (err, result) => {
          if (err) {
            console.log("could no insert new floor.");
            console.error(err);
          } else {
            console.log("Insert floor complete. sending result...");
            res.json(result);
          }
        });
      //  console.log("req.body.data", req.body);
    },
  },
  {
    method: "all",
    path: "/test",
    fn: (req, res, next) => {
      r.table("testTable").run(app._rdbConn, (err, result) => {
        if (err) return next(err);

        res.json(result);
      });
    },
  },
]);

//connect to rethinkDB and start express
async.waterfall([
  function connect(callback) {
    console.log("conecting to rdb");
    r.connect(config.rethinkdb, callback);
  },
  function startExpress(connection) {
    console.log("starting express");
    app._rdbConn = connection;
    app.listen(config.express.port, () =>
      console.log(
        `Express API listening on http://localhost:${config.express.port}`
      )
    );
  },
]);
