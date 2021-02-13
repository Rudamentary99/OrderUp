var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//var usersRouter = require("./routes/users");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
/**
 * Creates the express app with an array of routes
 * @param {Object[]} pRoutes
 * @returns {object} returns an express app
 */
module.exports = (pRoutes) => {
  //create each route
  pRoutes.forEach((route) => {
    const { method, path, fn } = route;
    app[method](path, fn);
  });

  //add 404 as final route
  app.use(function (req, res, next) {
    next(createError(404));
  });
  return app;
};

//module.exports = getExpressApp;