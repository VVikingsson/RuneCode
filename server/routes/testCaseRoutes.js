const express = require('express');
const { testCaseController } = require('../controllers');
const { authenticateToken } = require('../middleware/auth.js');
const { checkAdmin } = require('../middleware.js');

const router = express.Router();

router.post('', testCaseController.createNewTestCase); // Done
router.get('/:id', testCaseController.getTestCase); // Done
router.get('', testCaseController.getAllTestCases); // Done
router.delete('/:id', testCaseController.removeTestCase); // Done
router.patch('/:id', testCaseController.updateTestCase); // Done
// put moved to challengeRoutes

module.exports = router;