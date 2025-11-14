const express = require('express');
const router = express.Router();
const { exampleController } = require('../controllers');

// "When this endpoint is accessed with this operation (get/post..), what function should be called?"
router.get('/topScorer', exampleController.getTopScorer);
router.post('/new', exampleController.createExample); // bad practice. A good practice for creating a new resource
router.get('/all', exampleController.getAllExamples); // is to have that be a POST operation on the collection endpoint

module.exports = router;