const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();
const upload = require('../multerConfig'); //for handling pictures uploaded by users

router.post('', userController.createNewUser);
router.post('/login', userController.loginUser); // Standard is to use post for login actions
router.get('', userController.getAllUsers);
router.delete('/:id', userController.removeUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.post('/:id/image', upload.single('profileImage'), userController.uploadImage);

module.exports = router;