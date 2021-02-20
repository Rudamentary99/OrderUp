const r = require("rethinkdb");

module.exports = (rdbConn) => [
  {
    method: "get",
    path: "/api/food",
    fn: (req, res) => {
      r.table("food").run(rdbConn, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log("result", result);
        }
      });
    },
  },
  {
    method: "post",
    path: "/api/food",
    fn: (req, res) => {
      //console.log("rdbConn", rdbConn);
      r.table("food")
        .insert(req.body)
        .run(rdbConn, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            res.json({ id: result.generated_keys[0] });
            // console.log("result", result);
          }
        });
    },
  },
];
