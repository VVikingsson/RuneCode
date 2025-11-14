const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

router.post('', userController.createNewUser);
router.post('/login', userController.loginUser); // Standard is to use post for login actions
router.get('', userController.getAllUsers);
router.delete('/:id', userController.removeUser);

module.exports = router;