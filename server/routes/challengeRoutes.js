const express = require('express');
const { challengeController } = require('../controllers');

const router = express.Router();

router.get('/:id', challengeController.getChallenge);
router.get('', challengeController.getAllChallenges);
router.get('/:id/test-cases', challengeController.getRelatedTestCases);

router.delete('/:id', challengeController.removeChallenge);
router.delete('/:id/test-cases/:testCaseId', challengeController.removeRelatedTestCase)

router.patch('/:id', challengeController.updateChallenge);

router.post('/execute/:id', challengeController.executeCode);
router.post('/:id/test-cases', challengeController.addTestCase);
router.post('', challengeController.createNewChallenge);


module.exports = router;