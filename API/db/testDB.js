let express = require("express");
let router = express.Router();
//import { r, conn } from "./dbConnector";

router.all("/", (req, res, next) => {
  res.send("Hello World");
});

module.exports = router;
