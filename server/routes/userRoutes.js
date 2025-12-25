const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();
const upload = require('../multerConfig'); //for handling pictures uploaded by users
const { authenticateToken } = require('../middleware/auth.js');

router.post('', userController.createNewUser);
router.post('/sessions', userController.loginUser); // Standard is to use post for login actions
router.get('', userController.getAllUsers);
router.delete('/:id', userController.removeUser);
router.get('/search', userController.searchUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
// upload is a Multer instance that acts as a central middleware processor for handling file uploads
// upload.single('profileImage') tells upload middleware to upload the picture with the 'profileImage' name field value
// from html <input> tag
router.post('/:id/image', upload.single('profileImage'), userController.uploadImage);
// get all submissions of a specific user with related challenges
router.get('/:id/submissions', userController.getRelatedSubmissions);
router.get('/auth/me', authenticateToken, (req, res, next) => {
    try {
        res.status(200).json({user: req.user});
    } catch (err) {
        next(err);
    }
});

module.exports = router;