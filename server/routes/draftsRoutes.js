const express = require('express');
const { challengeController } = require('../controllers');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

router.post('', authenticateToken, challengeController.executeCode); // Done

module.exports = router;
