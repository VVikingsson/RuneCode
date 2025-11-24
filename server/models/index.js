// This file acts as a single point of import for other files wanting to access the MongoDB models

const Example = require("./Example.js");
const User = require("./User.js");
const Challenge = require("./Challenge.js");
const TestCase = require("./TestCase.js");
const Submission = require("./Submission.js");
const Workspace = require('./Workspace.js')
const DraftSubmission = require("./DraftSubmission");

module.exports = {
    Example,
    User,
    Challenge,
    TestCase,
    Submission,
    Workspace,
    DraftSubmission,
}