const r = require("rethinkdb");

module.exports = (rdbConn) => [
  {
    method: "get",
    path: "/api/foods/:archived",
    fn: (req, res) => {
      // console.log("req.params", req.params);
      r.table("food")
        .filter((row) => row("archived").eq(req.params.archived == "true"))
        .run(rdbConn, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            res.json(result._responses[0]);
          }
        });
    },
  },
  {
    method: "get",
    path: "/api/food/:id",
    fn: (req, res) => {
      console.log("req.params", req.params);
      r.table("food")
        .get(req?.params?.id)
        .run(rdbConn, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            res.json(result);
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
  {
    method: "post",
    path: "/api/food/:id/update",
    fn: (req, res) => {
      r.table("food")
        .get(req.params.id)
        .update(req.body)
        .run(rdbConn, (err, result) => {
          if (err) console.error(err);
          else res.end();
        });
    },
  },
];
