const multer = require('multer'); //for uploading users' profile pictures
const path = require('path');
require('dotenv').config();


const storage = multer.diskStorage({ //put this after connection function
    destination: function(req, file, cb)  {
        cb(null, process.env.UPLOADS)
    },
    filename: function(req, file, cb)  {
        cb(null, req.params.id + path.extname(file.originalname)); //file is saved to the path with the name {userId}.jpg fro example
    }
});

const upload = multer({ storage: storage,
                                       limits: { fileSize: 5 * 1024 * 1024 }, // 5 mb limit for pictures
});

module.exports = upload;
