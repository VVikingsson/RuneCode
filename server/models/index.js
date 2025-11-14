// This file acts as a single point of import for other files wanting to access the MongoDB models

const Example = require("./Example.js");
const User = require("./User.js");

module.exports = {
    Example,
    User //,
    // other Models goes here
}