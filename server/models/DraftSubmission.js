const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const DraftSubmissionSchema = new mongoose.Schema({
    code: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    challenge: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true},
    language: {type: String, required: true}
});


module.exports = mongoose.model('DraftSubmission', DraftSubmissionSchema);