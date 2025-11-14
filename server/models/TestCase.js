const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({

    input: {type: String, required: true},
    expectedOutput: {type: String, required: true},
    language: {type: String, required: true},

});


module.exports = mongoose.model('TestCase', TestCaseSchema);