const multer = require('multer'); //for uploading users' profile pictures
const path = require('path');
require('dotenv').config();


const storage = multer.diskStorage({ //put this after connection function
    destination: function(req, file, cb)  {
        cb(null, process.env.UPLOADS) //cb is a callback function provided by Multer, it tells Multer that the logic is complete and passes the result back to Multer
    },
    filename: function(req, file, cb)  {
        cb(null, req.user.id ); //file is saved to the path with the name {userId}.jpg fro example
    }
});

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
];
// for controlling what mime types of pictures users can upload
function fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new Error('invalid file type. Only jpeg, png or webp allowed'), false);
    }
    cb(null, true);
}

const upload = multer({ storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for pictures
    fileFilter
});

module.exports = upload;
