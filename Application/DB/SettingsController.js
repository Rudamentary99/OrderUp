import axios from "axios";
import { getData } from "../Storage";
getData("serverInfo")
  .then(({ host, port }) => {
    axios.defaults.baseURL = `http://${host}:${port}`;
  })
  .catch((err) => {
    console.error(err);
  });
export async function getTags() {
  return await axios
    .get("api/settings/tags")
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function updateTags(tags, removedTags) {
  return await axios
    .post("api/settings/tags", { tags: tags, removedTags: removedTags })
    .then((result) => {
      return result.status == 200;
    })
    .catch((err) => {
      console.error(err);
    });
}
