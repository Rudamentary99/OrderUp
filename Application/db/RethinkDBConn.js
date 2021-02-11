//import React from "react";

var r = require("rethinkdb");

r.connect({
  host: "172.25.16.184",
  port: 28015,
  timeout: 5000,
});

export default r;
