var r = require("rethinkdb");

module.exports = (dbConn) => [
  {
    method: "post",
    path: "/api/floor/create",
    fn: (req, res) => {
      r.table("floor")
        .insert(req.body)
        .run(dbConn, (err, result, next) => {
          if (err) {
            console.log("could no insert new floor.");
            console.error(err);
            next(err);
          } else {
            console.log("Insert floor complete. sending result...");
            res.json(result);
          }
        });
      //  console.log("req.body.data", req.body);
    },
  },
  {
    method: "get",
    path: "/api/floor",
    fn: (req, res) => {
      r.table("floor").run(dbConn, (err, result, next) => {
        if (err) {
          console.log("could no get floors");
          console.error(err);
          next(err);
        } else {
          res.json(result._responses[0]);
        }
      });
    },
  },
  {
    method: "get",
    path: "/api/floor/:id",
    fn: (req, res) => {
      r.table("floor")
        .get(req.params.id)
        .run(dbConn, (err, result, next) => {
          if (err) {
            console.log("could no get floors");
            console.error(err);
            next(err);
          } else {
            console.log("result", result);
            //res.json(result._responses[0]);
          }
        });

      console.log("req.params", req.params);
    },
  },
];
