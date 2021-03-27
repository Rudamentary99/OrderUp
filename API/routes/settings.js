const async = require("async");

const r = require("rethinkdb");
module.exports = (rdbConn) => [
  {
    method: "get",
    path: "/api/settings/tags",
    fn: (req, res) => {
      r.table("tag").run(rdbConn, (error, result) => {
        if (error) {
          console.error(error);
          res.status(400).send({ error: error });
        } else {
          res.json(result?._responses[0]?.r);
          //  console.log(`result`, result._responses);
          //res.send;
        }
      });
    },
  },
  {
    method: "post",
    path: "/api/settings/tags",
    fn: (req, res) => {
      const { tags, removedTags } = req.body;
      console.log(`removedTags`, removedTags);
      try {
        async.waterfall([
          function saveNewTags(callback) {
            r.table("tag")
              .insert(tags.filter(({ id }) => !id))
              .run(rdbConn, callback);
          },
          function removeTags(result, callback) {
            r.table("tag")
              .getAll(r.args(removedTags.map(({ id }) => id)))
              .delete()
              .run(rdbConn, callback);
          },
          function cleeanUp(result) {
            res.send();
          },
        ]);
      } catch (error) {
        console.error(error);
      }
      //  res.send();
    },
  },
];
