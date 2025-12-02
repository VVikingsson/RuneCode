const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({

    input: {type: String, required: true},
    expectedOutput: {type: String, required: isRequired}, // allow empty string
    language: {type: String, required: true},

});

function isRequired () {
    return typeof this.expectedOutput === 'string' ? false : true
}

module.exports = mongoose.model('TestCase', TestCaseSchema);