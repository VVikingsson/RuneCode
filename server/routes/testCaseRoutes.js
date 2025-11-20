const express = require('express');
const { testCaseController } = require('../controllers');

const router = express.Router();

router.post('', testCaseController.createNewTestCase);
router.get('/:id', testCaseController.getTestCase);
router.get('', testCaseController.getAllTestCases);
router.delete('/:id', testCaseController.removeTestCase);
router.patch('/:id', testCaseController.updateTestCase);

module.exports = router;