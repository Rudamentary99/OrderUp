let r = require("rethinkdb");
const conn = r.connect();

module.exports = {
  r,
  conn,
};
