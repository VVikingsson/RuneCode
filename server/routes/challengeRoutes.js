const express = require('express');
const { challengeController } = require('../controllers');

const router = express.Router();

router.post('', challengeController.createNewChallenge);
router.get('/:id', challengeController.getChallenge);
router.get('', challengeController.getAllChallenges);
router.delete('/:id', challengeController.removeChallenge);
router.patch('/:id', challengeController.updateChallenge);
router.post('/execute/:id', challengeController.executeCode);
router.get('/:id/submissions', challengeController.getRelatedSubmissions);

module.exports = router;