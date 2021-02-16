const axios = require("axios");
axios.defaults.baseURL = "http://172.25.19.198:3000";
async function createNewFloor(floorName) {
  try {
    const resp = await axios.post("/api/testBody", {
      name: floorName,
    });
    console.log("resp", resp);
  } catch (error) {
    console.log("Could not complete request. View stacktrace for details.");

    console.error(error.response.data);
  }
}

module.exports = {
  createNewFloor,
};