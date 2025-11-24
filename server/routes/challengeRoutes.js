const express = require('express');
const { challengeController } = require('../controllers');
const { verifyJWT, checkAdmin } = require('../middleware.js')

const router = express.Router();

router.post('', verifyJWT, checkAdmin, challengeController.createNewChallenge);
router.get('/:id', challengeController.getChallenge);
router.get('', challengeController.getAllChallenges);
router.delete('/:id', verifyJWT, checkAdmin, challengeController.removeChallenge);
router.patch('/:id', verifyJWT, checkAdmin, challengeController.updateChallenge);
router.post('/execute/:id', challengeController.executeCode);

module.exports = router;