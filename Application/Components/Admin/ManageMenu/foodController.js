const axios = require("axios");
const ip = "172.25.17.99";
axios.defaults.baseURL = `http://${ip}:3000`;

/**
 * @returns {Object[]} foodItems
 */
function getFoodItems() {
  axios
    .get("/api/food")
    .then((result) => {
      console.log("result.data", result.data);
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 *
 * @param {Object} foodItem
 * @returns {Object} data (reaturns object containing the id of new food)
 */
function createFoodItem(foodItem) {
  axios
    .post("/api/food/", foodItem)
    .then((result) => {
      return result.data;
      //   console.log("result", result);
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = {
  getFoodItems,
  createFoodItem,
};
