import fs from 'fs'
import path from 'path'

export function checkAvatarExists(req, res, next) {

    const imgPath = path.join(process.env.UPLOADS, `${req.user.id}`)
    req.avatarExists = fs.existsSync(imgPath)

    next()
}