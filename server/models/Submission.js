const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    code: {type: String, required: true},
    authorNote: {type: String},
    authorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    challengeId: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true},
});


module.exports = mongoose.model('Submission', SubmissionSchema);