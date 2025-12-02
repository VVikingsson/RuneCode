const express = require('express');
const { challengeController } = require('../controllers');

const router = express.Router();

router.post('', challengeController.executeCode);

module.exports = router;
