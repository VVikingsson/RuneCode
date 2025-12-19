const express = require('express');
const { submissionController } = require('../controllers');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();
router.post('', authenticateToken, submissionController.createSubmission);
//modify submission with a certain id
router.patch('/:id', submissionController.updateSubmission);
//get one submission by id
router.get('/:id', submissionController.getSubmission);
//delete one submission with a given id
router.delete('/:id', submissionController.deleteSubmission);

module.exports = router;