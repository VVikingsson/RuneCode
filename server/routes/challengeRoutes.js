const express = require('express');
const { challengeController } = require('../controllers');
const { verifyJWT, checkAdmin } = require('../middleware.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

router.get('/recommendedChallenges', challengeController.getRecommendedChallenge);
router.get('/:id', challengeController.getChallenge);
router.get('/:id/submissions', challengeController.getRelatedSubmissions);
router.get('', challengeController.getAllChallenges);
router.get('/:id/test-cases', challengeController.getRelatedTestCases);
router.get('/:id/test-cases/:testCaseId', challengeController.getRelatedTestCase);

router.delete('/:id/test-cases/:testCaseId', challengeController.removeRelatedTestCase)
router.delete('/:id/test-cases', challengeController.removeRelatedTestCases)
router.delete('/:id', verifyJWT, checkAdmin, challengeController.removeChallenge);

router.patch('/:id', verifyJWT, checkAdmin, challengeController.updateChallenge);

router.post('', verifyJWT, checkAdmin, challengeController.createNewChallenge);
router.post('/:id/test-cases', challengeController.addTestCase);

router.put('/:id/test-cases/:testCaseId',
    challengeController.createRelatedTestCaseIfDoesNotExist, challengeController.replaceRelatedTestCase);

module.exports = router;