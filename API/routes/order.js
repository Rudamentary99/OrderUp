const async = require("async");

const r = require("rethinkdb");
module.exports = (rdbConn) => [
  {
    method: "get",
    path: "/api/order/:type",
    fn: (req, res) => {
      let filter;
      switch (req.params.type) {
        case "open": {
          filter = (row) => row.hasFields("closeDate").not();
          break;
        }
        case "closed": {
          filter = (row) => row.hasFields("closeDate");
          break;
        }
        default: {
          filter = (row) => {
            return row.hasFields("id");
          };
          break;
        }
      }

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
    path: "/api/order/full/:type",
    fn: (req, res) => {
      // let filterTags = req.query.filterTags;
      // console.log(`filterTags`, filterTags);
      let typeFilter = (row) => {
        return row.hasFields("id");
      };
      if (req?.params?.type == "open") {
        typeFilter = (row) => row.hasFields("closeDate").not();
      } else if (req?.params?.type == "closed") {
        typeFilter = (row) => row.hasFields("closeDate");
      }

      r.table("order")
        .filter(typeFilter)
        .map((order) => {
          return order.merge({
            orderItems: r
              .table("orderItem")
              .getAll(order("id"), { index: "orderID" })
              .eqJoin("foodID", r.table("food"))
              .without({ right: "id" })
              .zip()
              // .filter((item) => {
              //   if (filterTags?.length) {
              //     console.log("filtering");
              //     let rv = false;
              //     if (item.hasFields({ customization: { customTags: true } })) {
              //       console.log("filter custom fields");
              //       filterTags.forEach((tag) => {
              //         if (item("customization")("customTags").contains(tag)) {
              //           console.log("returning true");
              //           rv = true;
              //           return;
              //         }
              //       });
              //     } else if (item.hasFields("tags")) {
              //       console.log("filtering normal fields");
              //       filterTags.forEach((tag) => {
              //         if (item("tags").contains(tag)) {
              //           rv = true;
              //           return;
              //         }
              //       });
              //     }
              //     return rv;
              //   } else {
              //     return true;
              //   }
              // })

              .coerceTo("array"),
          });
        })
        // .filter((row) => {
        //   if (row.hasFields())
        //     if (row.hasFields("tags")) {
        //     }
        // })
        .run(rdbConn, (err, result) => {
          if (err) {
            console.error(err);
            res.status(400).send({ error: err });
          } else if (result.errors) {
            console.error("Something went wrong! Could not get full order");
            res
              .status(400)
              .send({ error: "something went wrong", result: result });
          } else {
            res.json(result?._responses[0]?.r);
          }
        });
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
    method: "get",
    path: "/api/orderItems/full/simple",
    fn: (req, res) => {
      r.table("orderItem")
        .eqJoin("orderID", r.table("order"))
        .without({ right: "id" })
        .zip()
        .run(rdbConn, (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(400)
              .send({ message: "Could not get order items >:(", error: err });
          } else {
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
    path: "/api/orderItem/:id",
    fn: (req, res) => {
      r.table("orderItem")
        .get(req.params.id)
        .update(req.body)
        .run(rdbConn, (err, result) => {
          if (err) {
            console.error(err);
            res.status(400).send({ error: err });
          } else {
            res.send();
          }
        });
    },
  },
  {
    method: "get",
    path: "/api/orderItem/:id",
    fn: (req, res) => {
      r.table("orderItem")
        .eqJoin("foodID", r.table("food"))
        .without({ right: "id" })
        .zip()
        .filter((row) => row("id").eq(req.params.id))
        .run(rdbConn, (err, result) => {
          if (err) {
            console.error(err);
            res.status(400).send({ message: "ran into an err", error: err });
          } else {
            res.json(result._responses[0].r[0]);
            // res.send();
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
              customization: item.customization || null,
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
                    customization: item.customization || null,
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
  {
    method: "post",
    path: "/api/orderItems/complete",
    fn: (req, res) => {
      console.log(`req.body`, req.body);
      r.table("orderItem")
        .getAll(...req.body.items)
        .update({ completed: true, completionTime: new Date() })
        .run(rdbConn, (err, result) => {
          console.log(`result`, result);
          if (err) {
            console.error(err);
            res
              .status(400)
              .send({ message: "could not mark items complete", err: err });
          } else {
            res.end();
          }
        });
    },
  },
  {
    method: "post",
    path: "/api/order/:id/close",
    fn: (req, res) => {
      r.table("order")
        .get(req.params.id)
        .update({ closeDate: Date.now() })
        .run(rdbConn, (err, result) => {
          if (err || result.errors) {
            console.error(err);
            res
              .status(400)
              .send({ message: "Could not close order :|", error: err });
          } else {
            console.log("result", result);
            res.end();
          }
        });
    },
  },
  {
    method: "post",
    path: "/api/order/:id/open",
    fn: (req, res) => {
      r.table("order")
        .get(req.params.id)
        .update({ closeDate: null })
        .run(rdbConn, (err, result) => {
          if (err || result.errors) {
            console.error(err);
            res
              .status(400)
              .send({ message: "Could not close order :|", error: err });
          } else {
            console.log("result", result);
            res.end();
          }
        });
    },
  },
];
