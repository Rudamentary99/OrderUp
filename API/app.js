var async = require("async");
const fs = require("fs");
var r = require("rethinkdb");
var indexRouter = require("./routes/index");
//get App Config
const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));

var app = require("./expressApp");

//var usersRouter = require("./routes/users");

// Load config for RethinkDB and express

//app.use("/", indexRouter);
//app.use("/users", usersRouter);
// app.all("/test", (req, res, next) => {
//   r.table("testTable").run(app._rdbConn, (err, result) => {
//     if (err) return next(err);

//     res.json(result);
//   });
// });
// app.all("/api/testBody", (req, res, next) => {
//   try {
//     res.send(req.body);
//   } catch (error) {
//     next(error);
//   }
// });
// app.all("/api/testParams", (req, res) => {
//   res.send(req.params);
// });

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
