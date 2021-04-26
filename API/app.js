var async = require("async");
const fs = require("fs");
var r = require("rethinkdb");
const testRoutes = require("./routes/testRoutes");
const foodRoutes = require("./routes/food");
const orderRoutes = require("./routes/order");
const foodTypeRoutes = require("./routes/foodType");
const settingRoutes = require("./routes/settings");
const expressApp = require("./expressApp");
const { exec } = require("child_process");

//get App Config
const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));

const getRoutes = (dbConn) => [
  ...testRoutes,
  ...foodRoutes(dbConn),
  ...foodTypeRoutes(dbConn),
  ...orderRoutes(dbConn),
  ...settingRoutes(dbConn),
  {
    method: "all",
    path: "/test",
    fn: (req, res, next) => {
      r.table("testTable").run(dbConn, (err, result) => {
        if (err) return next(err);

        res.json(result);
      });
    },
  },
];

//connect to rethinkDB and start express
async.waterfall([
  function connect(callback) {
    console.log("conecting to rdb");
    r.connect(config.rethinkdb, callback);
  },
  function startExpress(connection) {
    //get express app
    var app = expressApp(getRoutes(connection));
    console.log("starting express");
    app._rdbConn = connection;
    app.listen(config.express.port, () =>
      console.log(
        `Express API listening on http://localhost:${config.express.port}`
      )
    );
  },
]);
