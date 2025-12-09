const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, trim: true},
    codeTemplatePython: {type: String, required: true},
    codeTemplateJavascript: {type: String, required: true},
    description: {type: String, required: true},
    testCases: [{type: Schema.Types.ObjectId, ref: 'TestCase'}],
    difficulty: {type: String, required: true},
    tags: [{type: String}]
});

ChallengeSchema.pre("save", function(next) {
    for (let i = 0; i < this.tags.length; i++) {
        this.tags[i] = this.tags[i].toLowerCase();
    }
    next();
});

module.exports = mongoose.model('Challenge', ChallengeSchema);