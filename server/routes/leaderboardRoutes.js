const express = require('express');
const { userController } = require('../controllers');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('', (req, res, next) => {
    authenticateToken(req, res, () => next());
}, userController.getTop100Users); // Done

module.exports = router;