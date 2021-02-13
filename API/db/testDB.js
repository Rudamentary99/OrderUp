let express = require("express");
let router = express.Router();
let r = require("rethinkdb");
let conn = r.connect();
router.all("/", [
  //make connection
  (req, res, next) => {
    res._conn = conn;
  },
  //after connection is made get testTable
  (req, res, next) => {
    r.table("testTable").run(res._conn, (err, result) => {
      if (err) {
        return next(err);
      } else {
        res.json(result);
      }
    });
    // r.table("testTable").run(conn, (err, cursor) => {
    //   res.send(cursor);
    // });
  },
]);

module.exports = router;
