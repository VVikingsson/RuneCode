const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const WorkspaceSchema = new mongoose.Schema/{
    challenge: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true, trim: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true, trim: true},
    code: {type: String, required: true}
}

module.exports = mongoose.model('Workspace', WorkspaceSchema);