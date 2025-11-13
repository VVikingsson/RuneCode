// Remember C from MVC from OOP? He's back...
// A controller is responsible for connecting endpoints to corresponding backend functionality.

const { Example } = require('../models'); // imported from models/index.js

async function getTopScorer(req, res, next) {
  try {
    const topScorer = await Example.findHighestScorer();
    res.json(topScorer); //res.json sends the response back to client with given argument (a valid JS object) as body.
  } catch (err) {
    next(err); // pass error to global error handler
  }
}

async function getAllExamples(req, res, next) {
  try {
    const examples = await Example.findAll();
    res.json(examples);
  } catch (err) {
    next(err);
  }
}

async function createExample(req, res, next) {
    try {
        let example = new Example(req.body);
        await example.save();
        res.status(201).json(example); // status() returns the res object itself, allowing such a "chain" of methods.
    } catch (err) {
    next(err); 
    }
}

module.exports = {
  getTopScorer,
  createExample,
  getAllExamples
};