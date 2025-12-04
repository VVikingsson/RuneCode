const express = require('express');
const { challengeController } = require('../controllers');
const { verifyJWT, checkAdmin } = require('../middleware.js')

const router = express.Router();

router.get('/:id', challengeController.getChallenge);
router.get('/:id/submissions', challengeController.getRelatedSubmissions);
router.get('', (req, res) => { 
    return req.query.recommendedChallengeFor
    ? challengeController.getRecommendedChallenge(req, res)
    : challengeController.getAllChallenges(req, res)

});
router.get('/:id/test-cases', challengeController.getRelatedTestCases);
router.get('/:id/test-cases/:testCaseId', challengeController.getRelatedTestCase);

router.delete('/:id/test-cases/:testCaseId', challengeController.removeRelatedTestCase)
router.delete('/:id', verifyJWT, checkAdmin, challengeController.removeChallenge);

router.patch('/:id', verifyJWT, checkAdmin, challengeController.updateChallenge);

router.post('', verifyJWT, checkAdmin, challengeController.createNewChallenge);
router.post('/:id/test-cases', challengeController.addTestCase);


module.exports = router;