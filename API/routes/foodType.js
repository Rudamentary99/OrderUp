const r = require("rethinkdb");

module.exports = (rdbConn) => [
  {
    method: "get",
    path: "/api/foodTypes/",
    fn: (req, res) => {
      r.table("foodTypes").run(rdbConn, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.json(result._responses[0].r);
          res.end();
        }
      });
    },
  },
];
