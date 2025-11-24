const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const PendingSubmissionSchema = new mongoose.Schema({
    code: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    challenge: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true},

}, );


module.exports = mongoose.model('pendingSubmission', PendingSubmissionSchema);