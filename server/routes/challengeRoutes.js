const express = require('express');
const { challengeController } = require('../controllers');
const { verifyJWT, checkAdmin } = require('../middleware.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

router.get('/recommendedChallenges', challengeController.getRecommendedChallenge); // Done
router.get('/:id', challengeController.getChallenge); // Done
router.get('/:id/submissions', challengeController.getRelatedSubmissions); // Done
router.get('', challengeController.getAllChallenges); // Done
router.get('/:id/test-cases', challengeController.getRelatedTestCases); // Done
router.get('/:id/test-cases/:testCaseId', challengeController.getRelatedTestCase); // Done

router.delete('/:id/test-cases/:testCaseId', challengeController.removeRelatedTestCase)
router.delete('/:id/test-cases', authenticateToken, challengeController.removeRelatedTestCases) // Done
router.delete('/:id', verifyJWT, checkAdmin, challengeController.removeChallenge); // Done

router.patch('/:id', verifyJWT, checkAdmin, challengeController.updateChallenge); // Done

router.post('', verifyJWT, checkAdmin, challengeController.createNewChallenge); // Done
router.post('/:id/test-cases', authenticateToken, challengeController.addTestCase); // Done

router.put('/:id/test-cases/:testCaseId', authenticateToken,
    challengeController.createRelatedTestCaseIfDoesNotExist, challengeController.replaceRelatedTestCase); // Done

module.exports = router;