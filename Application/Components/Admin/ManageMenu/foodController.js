const axios = require("axios");
import config from "../../../config";
axios.defaults.baseURL = config.axios.baseURL;
/**
 * @description Gets all FoodItems
 * @param {Boolean} archived get archived or non-archived
 * @returns {Object[]}
 */
async function getFoodItems(archived) {
  const result = await axios
    .get("/api/foods/" + archived)
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
 * Gets a single food item;
 * @param {string} id
 * @returns {object} FoodItem
 */
async function getFoodItem(id) {
  return await axios
    .get(`api/food/${id}`)
    .then((result) => {
      return result.data;
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
async function createFoodItem(foodItem) {
  return await axios
    .post("/api/food/", foodItem)
    .then((result) => {
      return result.data;
      //   console.log("result", result);
    })
    .catch((err) => {
      console.error(err);
    });
}
/**
 *
 * @param {Object} foodItem
 * @returns {Boolean} success
 */
async function updateFoodItem(foodItem) {
  const result = await axios
    .post("/api/food/" + foodItem.id + "/update", foodItem)
    .then((result) => {
      //console.log("result.status", result.status);
      if (result.status == 200) return true;
      else return false;
      //console.log("result.data", result.data);
    })
    .catch((err) => {
      console.error(err);
    });
  return result;
}

module.exports = {
  getFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
};
