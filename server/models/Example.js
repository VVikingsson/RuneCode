// Models are compiled MongoDB Schemas. They exist only in 
// memory and allow the backend to interface with the actual DB.
// In general, the mongoose docs are very easy to use and understand:
// https://mongoosejs.com/

// (0) Imports
const mongoose = require("mongoose");

// (1) Define schema
const ExampleSchema = new mongoose.Schema({
    name: String,   // String is shorthand for { type: String }
    points: Number,
    date: { type: Date, default: Date.now } // Default values <--
    // _id automatically generated
});

// (2) Pre/post hooks: 
// "Run something before or after a certain query/document operation" docs: https://mongoosejs.com/docs/api/schema.html#Schema.prototype.post()
// This example ensures that name is always lowercase before saving.
ExampleSchema.pre("save", function(next) { // next is a function that needs to be called to continue the chain
  this.name = this.name.toLowerCase();
  next();
});

// (3) Defining methods
// On document level (this = an instance)
ExampleSchema.methods.printState = function () {
    console.log("ID:", this._id);
    console.log("Name:", this.name);
    console.log("Points:", this.points);
    console.log("Date:", this.date);
};

// (4) Static methods
// On collection level (this = reference to collection)
ExampleSchema.statics.findHighestScorer = function () {
  return this.findOne().sort({ points: -1 }).exec(); // -1 indicates decreasing order. findOne picks the first document
};

ExampleSchema.statics.findAll = function () {
  return this.find();
}

// (5) Export: when another file uses require(example), it will get the compiled model of the schema.
module.exports = mongoose.model("Example", ExampleSchema);