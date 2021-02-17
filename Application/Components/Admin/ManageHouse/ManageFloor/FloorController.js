const axios = require("axios");
axios.defaults.baseURL = "http://172.25.20.146:3000";
async function createNewFloor(floorName) {
  console.log("Creating Floor");
  try {
    const resp = await axios.post("/api/floor/create", {
      name: floorName,
      tables: [],
    });
    if (resp.status == 200)
      return {
        key: resp.data.generated_keys[0],
        name: floorName,
        tables: [],
      };
  } catch (error) {
    console.log("Could not complete request. View stacktrace for details.");

    console.error(error.response.data);
  }
}

async function getFloors() {
  console.log("fetching floors");
  try {
    const resp = await axios.get("/api/floor");
    if (resp.status == 200) {
      console.log("got floors");
      return resp.data;
      //console.log("resp.data", resp.data);
    }
  } catch (error) {
    console.log("Could not get floors. View stacktrace for details");
    console.error(errror);
  }
}

module.exports = {
  createNewFloor,
  getFloors,
};
