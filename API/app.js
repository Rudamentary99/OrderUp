var async = require("async");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var r = require("rethinkdb");
//var indexRouter = require("./routes/index");
//var usersRouter = require("./routes/users");
var app = express();
// Load config for RethinkDB and express
var config = require(`${__dirname}/config.js`);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
//app.use("/users", usersRouter);
app.all("/test", (req, res, next) => {
  r.table("testTable").run(app._rdbConn, (err, result) => {
    if (err) return next(err);

    res.json(result);
  });
});
app.all("/api/testBody", (req, res, next) => {
  try {
    res.send(req.body);
  } catch (error) {
    next(error);
  }
});
app.all("/api/testParams", (req, res) => {
  res.send(req.params);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
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
