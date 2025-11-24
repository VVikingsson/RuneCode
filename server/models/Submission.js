const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    code: {type: String, required: true},
    title: {type: String, default: ''},
    authorNote: {type: String, default: ''},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    challenge: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true},

}, {timestamps: true});


module.exports = mongoose.model('Submission', SubmissionSchema);