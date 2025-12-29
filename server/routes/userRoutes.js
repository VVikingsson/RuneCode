const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();
const upload = require('../multerConfig'); //for handling pictures uploaded by users
const { authenticateToken } = require('../middleware/auth.js');


router.get('', userController.getAllUsers);
router.get('/search', userController.searchUser);
router.get('/:id', authenticateToken, userController.getUser);
// get all submissions of a specific user with related challenges
router.get('/:id/submissions', userController.getRelatedSubmissions);
router.get('/auth/me', authenticateToken, (req, res, next) => {
    try {
        res.status(200).json({user: req.user});
    } catch (err) {
        next(err);
    }
});

//needs modification
router.delete('/:id', authenticateToken, userController.removeUser);
// form url for the picture

router.post('', userController.createNewUser);
router.post('/sessions', userController.loginUser); // Standard is to use post for login actions
// upload is a Multer instance that acts as a central middleware processor for handling file uploads
// upload.single('profileImage') tells upload middleware to upload the picture with the 'profileImage' name field value
// from html <input> tag
router.post('/avatar', authenticateToken, upload.single('profileImage'), userController.uploadImage);

router.patch('/:id', authenticateToken, userController.updateUser);



module.exports = router;