const axios = require("axios");
const ip = "172.25.18.207";
axios.defaults.baseURL = `http://${ip}:3000`;

async function getFoodItems() {
  const result = await axios
    .get("/api/food")
    .then((result) => {
      //console.log("result.data", result.data.r);
      return result.data.r;
    })
    .catch((err) => {
      console.error(err);
    });
  return result;
  //console.log("result", result);
}

/**
 *
 * @param {Object} foodItem
 * @returns {Object} data (reaturns object containing the id of new food)
 */
async function createFoodItem(foodItem) {
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
async function updateFoodItem(foodItem) {
  axios
    .post("/api/food/" + foodItem.id + "/update", foodItem)
    .then((result) => {
      console.log("result.status", result.status);
      if (result.status == 200) return true;
      else return false;
      //console.log("result.data", result.data);
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = {
  getFoodItems,
  createFoodItem,
  updateFoodItem,
};
