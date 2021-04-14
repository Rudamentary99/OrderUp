const r = require("rethinkdb");
const async = require("async");
module.exports = (rdbConn) => [
  {
    method: "get",
    path: "/api/foodTypes/",
    fn: (req, res) => {
      r.table("foodType").run(rdbConn, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.json(result._responses[0].r);
          res.end();
        }
      });
    },
  },
  {
    method: "post",
    path: "/api/foodTypes/",
    fn: (req, res) => {
      const { foodTypes, removedFoodTypes } = req.body;
      async.waterfall([
        function saveNewFoodTypes(callback) {
          r.table("foodType")
            .insert(foodTypes.filter(({ id }) => !id))
            .run(rdbConn, callback);
        },
        function removeFoodTypes(result, callback) {
          r.table("foodType")
            .getAll(r.args(removedFoodTypes.map(({ id }) => id)))
            .delete()
            .run(rdbConn, callback);
        },
        function cleeanUp(result) {
          res.send();
        },
      ]);
    },
  },
];
