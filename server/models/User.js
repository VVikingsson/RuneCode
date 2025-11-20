const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    hashedPassword: {type: String, required: true, select: false},
    points: {type: Number, default: 0},
    bio: {type: String, trim: true}                                           // Password will by default not be selected in queries.
})                                                                // Can be selected by adding .select(+hashedPassword);
                                                                  // to the query.
UserSchema.statics.findByUsername = async function(username) {
    return this.findOne({username: username}); // Returns a promise
}

UserSchema.statics.findByEmail = async function(address) {
    return this.findOne({email: address}); // Returns a promise
}


module.exports = mongoose.model('User', UserSchema);