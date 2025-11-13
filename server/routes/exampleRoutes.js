const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// "When this endpoint is accessed with this operation (get/post..), what function should be called?"
router.get('/topScorer', exampleController.getTopScorer);
router.post('/new', exampleController.createExample);
router.get('/all', exampleController.getAllExamples);

module.exports = router;