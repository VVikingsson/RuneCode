const express = require('express');
const { submissionController } = require('../controllers');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();
router.post('', authenticateToken, submissionController.createSubmission); // Done
//modify submission with a certain id
router.patch('/:id', submissionController.updateSubmission); // Done
//get one submission by id
router.get('/:id', submissionController.getSubmission); // Done
//delete one submission with a given id
router.delete('/:id', submissionController.deleteSubmission); // Done

module.exports = router;