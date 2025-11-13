
const express = require("express");
const exampleRouter = require("./exampleRoutes")

const router = express.Router();

// Any endpoint we want to access from exampleRouter has to be prefixed with /example.
router.use("/example", exampleRouter)

module.exports = router;