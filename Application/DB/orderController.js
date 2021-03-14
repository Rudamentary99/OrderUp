const axios = require("axios");
import config from "../config";
axios.default.baseURL = config.axios.baseURL;

/**
 * Gets all orders
 * @param {string} type specifies filter {open, closed, all}
 * @returns {Array<Object>} orders
 */
export async function getOrders(type) {
  return await axios
    .get("api/order/" + type)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 * Gets Open orders and their foodItems
 * @returns {Object} orders
 */
export async function getOpenOrdersFull() {
  return await axios
    .get("api/order/full/open")
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
export async function getOrderItems(orderID) {
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
export async function createOrder(order) {
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
/**
 * Updates the OrderItems
 * @param {Object} order
 * @returns {Boolean} success
 */
export async function updateOrderItems(order) {
  return await axios
    .post("/api/order/" + order.id, order)
    .then((result) => {
      if (result.status == 200) return true;
      else return false;
      //console.log("result", result.status);
    })
    .catch((err) => {
      console.error(err);
    });
}
/**
 * closes an order
 * @param {string} orderID id of order you want to close
 * @returns {Boolean} success
 */
export async function closeOrder(orderID) {
  return await axios
    .post(`/api/order/${orderID}/close`)
    .then((result) => {
      if (result.status == 200) {
        return true;
      } else {
        console.log("result", result);
        return false;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
/**
 * opens an order
 * @param {string} orderID id of order you want to open
 * @returns {Boolean} success
 */
export async function openOrder(orderID) {
  return await axios
    .post(`/api/order/${orderID}/open`)
    .then((result) => {
      if (result.status == 200) {
        return true;
      } else {
        console.log("result", result);
        return false;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
/**
 * Deletes an order
 * @param {string} orderID id of order you want to cancel
 * @returns {Boolean} success
 */
export async function cancelOrder(orderID) {
  return await axios
    .post(`/api/order/${orderID}/cancel`)
    .then((result) => {
      if (result.status == 200) return true;
      else {
        console.log("result", result);
        return false;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
