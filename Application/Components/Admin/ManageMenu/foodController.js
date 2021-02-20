const axios = require("axios");
const ip = "172.25.17.99";
axios.defaults.baseURL = `${ip}:3000`;
/**
 *
 * @param {Object} foodItem
 */
function createFoodItem(foodItem) {
  axios
    .post("/api/food/", foodItem)
    .then((result) => {
      console.log("result", result);
    })
    .catch((err) => {
      console.error(err);
    });
}
