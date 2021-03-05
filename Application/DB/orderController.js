const axios = require("axios");
import config from "../config";
axios.default.baseURL = config.axios.baseURL;

/**
 * Gets all open orders
 * @returns {Array<Object>} orders
 */
async function getOpenOrders() {
  return await axios
    .get("api/order/open")
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
/**
 * Gets all orderItems for a specific order
 * @param {string} orderID
 */
async function getOrderItems(orderID) {
  return await axios
    .get("/api/orderItems/" + orderID)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 * creates order with the attributes of the passed object
 * @param {Object} order
 * @returns {boolean} declares success or failure
 */
async function createOrder(order) {
  return await axios
    .post("api/order/", order)
    .then((result) => {
      if (result.status == 200) {
        return true;
      } else return false;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function updateOrder(order) {
  return await axios
    .post("/api/order/" + order.id, order)
    .then((result) => {
      console.log("result", result);
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = {
  getOpenOrders,
  getOrderItems,
  createOrder,
};
