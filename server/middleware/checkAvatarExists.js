const fs = require("fs");
const path = require("path");

function checkAvatarExists(req, res, next) {

    const imgPath = path.join(process.env.UPLOADS, `${req.user.id}`)
    req.avatarExists = fs.existsSync(imgPath)

    next()
}

module.exports = {
    checkAvatarExists
}