const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();
const upload = require('../multerConfig'); //for handling pictures uploaded by users
const { authenticateToken } = require('../middleware/auth.js');
const { checkAvatarExists } = require('../middleware/checkAvatarExists.js');


router.get('', userController.getAllUsers); // Done
router.get('/auth/me', authenticateToken, (req, res, next) => {
    try {
        res.status(200).json({ user: req.user });
    } catch(err) {
        next(err);
    }
}); // Done
router.post('/auth/logout', (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
        res.sendStatus(204)
    } catch(err) {
        next(err);
    }}); // Done

router.get('/search', userController.searchUser); // Done
// get all submissions of a specific user with related challenges
router.get('/:id/submissions', userController.getRelatedSubmissions); // Done
router.get('/:id', authenticateToken, userController.getUser); // Done
//needs modification
router.delete('/:id', authenticateToken, userController.removeUser); // Done
// form url for the picture

router.post('', userController.createNewUser); // Done
router.post('/sessions', userController.loginUser); // Done // Standard is to use post for login actions
// upload is a Multer instance that acts as a central middleware processor for handling file uploads
// upload.single('profileImage') tells upload middleware to upload the picture with the 'profileImage' name field value
// from html <input> tag
router.put('/avatars', authenticateToken, checkAvatarExists, upload.single('profileImage'), userController.uploadImage); // Done

router.patch('/:id', authenticateToken, userController.updateUser); // Done



module.exports = router;