const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, trim: true},
    codeTemplate: {type: String, required: true},
    description: {type: String, required: true},
    testCases: [{type: Schema.Types.ObjectId, ref: 'TestCase'}],

});


module.exports = mongoose.model('Challenge', ChallengeSchema);