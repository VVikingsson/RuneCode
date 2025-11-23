const express = require('express');
const { challengeController } = require('../controllers');
const { authMiddleware, adminMiddleware } = require('../middleware.js')

const router = express.Router();

router.post('', authMiddleware, adminMiddleware, challengeController.createNewChallenge);
router.get('/:id', challengeController.getChallenge);
router.get('', challengeController.getAllChallenges);
router.delete('/:id', authMiddleware, adminMiddleware, challengeController.removeChallenge);
router.patch('/:id', authMiddleware, adminMiddleware, challengeController.updateChallenge);
router.post('/execute/:id', challengeController.executeCode);

module.exports = router;