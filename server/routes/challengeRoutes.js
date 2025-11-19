const express = require('express');
const { challengeController } = require('../controllers');

const router = express.Router();

router.get('/execute/:id', challengeController.executeCode);

module.exports = router;