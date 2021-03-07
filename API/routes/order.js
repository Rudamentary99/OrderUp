const async = require("async");

const r = require("rethinkdb");
module.exports = (rdbConn) => [
  {
    method: "get",
    path: "/api/order/:type",
    fn: (req, res) => {
      let filter = (row) => {
        // console.log("row", row("open").eq(true));
        return row("open").eq(true);
      };
      // if (req.params.type == "open") {
      //   filter = (row) => row("open").eq(true);
      // }
      console.log("filter", filter);
      try {
        r.table("order")
          .filter((row) => filter(row))
          .run(rdbConn, (err, result) => {
            if (err) {
              console.error(err);
            } else {
              res.json(result?._responses[0]?.r);
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
  },
  {
    method: "get",
    path: "/api/orderItems/:orderID",
    fn: (req, res) => {
      r.table("orderItem")
        .filter((row) => row("orderID").eq(req.params.orderID))
        .eqJoin("foodID", r.table("food"))
        .without({ right: "id" })
        .zip()
        .run(rdbConn, (err, result) => {
          if (err) console.error(err);
          else {
            const data = result?._responses[0]?.r;
            if (data) res.json(data);
            else
              res
                .status(400)
                .send({ message: "Could not get Order's Items :(" });
          }
        });
    },
  },
  {
    method: "post",
    path: "/api/order",
    fn: (req, res) => {
      async.waterfall([
        function createOrder(callback) {
          console.log("creating order");
          r.table("order")
            .insert({
              table: req.body.table,
              created: req.body.created,
              open: req.body.open,
            })
            .run(rdbConn, callback);
        },
        function createOrderItems(result, callback) {
          console.log("creating orderItems");
          if (result.errors) {
            console.log("result", result);
          } else {
            const orderItems = req.body.ticketItems.map((item) => ({
              //name: item.name,
              // foodType: item.foodType,
              // prepTime: item.prepTime,
              foodID: item.id,
              orderID: result.generated_keys[0],
            }));

            r.table("orderItem").insert(orderItems).run(rdbConn, callback);
          }
        },
        function returnResult(result) {
          console.log("wrapping up...");
          if (result.errors) {
            console.log("result", result);
          } else {
            res.end();
          }
        },
      ]);
    },
  },
  {
    method: "post",
    path: "/api/order/:id",
    fn: (req, res) => {
      //delete removed ticket items
      async.waterfall([
        function deleteRemoveditems(callback) {
          console.log(
            "req.body.removedItems.map(({ id }) => id)",
            req.body.removedItems.map(({ id }) => id)
          );
          r.table("orderItem")
            .getAll(r.args(req.body.removedItems.map(({ id }) => id)))
            .delete()
            .run(rdbConn, callback);
        },
        function addNewItems(result, callback) {
          console.log("result", result);
          if (!result.errors) {
            r.table("orderItem")
              .insert(
                req.body.ticketItems
                  .filter(({ orderID }) => !orderID)
                  .map((item) => ({
                    foodID: item.id,
                    orderID: req.params.id,
                  }))
              )
              .run(rdbConn, callback);
          }
        },
        function wrapUp(result) {
          if (result.errors) {
            res
              .status(400)
              .send({ message: "Could not add new order items :\\" });
          } else {
            res.end();
          }
        },
      ]);
    },
  },
  {
    method: "post",
    path: "/api/order/:id/cancel",
    fn: (req, res) => {
      console.log("req.params", req.params);
      async.waterfall([
        function deleteOrderItems(callback) {
          r.table("orderItem")
            .getAll(req.params.id, { index: "orderID" })
            .delete()
            .run(rdbConn, callback);
        },
        function deleteOrder(result, callback) {
          if (result.errors) {
            res
              .status(400)
              .send({ message: "Could not delete OrderItems: :|" });
          } else {
            r.table("order").get(req.params.id).delete().run(rdbConn, callback);
          }
        },
        function wrapUp(result) {
          if (result.errors) {
            res.status(400).send({
              message: "Something went wrong deleteing the order. :O",
            });
          } else {
            res.end();
          }
        },
      ]);
    },
  },
];
