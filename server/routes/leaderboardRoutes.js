const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

router.get('', userController.getTop100Users);

module.exports = router;