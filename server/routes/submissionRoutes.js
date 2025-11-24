const express = require('express');
const { submissionController } = require('../controllers');

const router = express.Router();
router.post('/', submissionController.createSubmission); //TEST
//modify submission with a certain id
router.patch('/:id', submissionController.updateSubmission); //TEST
//get one submission by id
router.get('/:id', submissionController.getSubmission); //TEST
//delete one submission with a given id
router.delete('/:id', submissionController.deleteSubmission); //TEST

module.exports = router;