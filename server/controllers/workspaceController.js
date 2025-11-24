const { Workspace } = require('../models');

async function saveWorkspace(req, res, next) {
    try {
        const challId = req.params.challId;
        const {userId, code} = req.body;
        for (const objectId of [challId, userId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        let workspace = await Workspace.findOne({challenge: challId, user: userId});
        if (!workspace) {
            workspace = await Workspace.create({challenge: challId, user: userId, code: code});
            return res.status(201).json({message: 'Successfully created workspace', workspace: workspace});
        }
        workspace.code = code;
        return res.status(200).json({message: 'Sucessfully updated workspace', workspace: workspace});
    } catch (err) {
        next(err);
    }
}

module.exports = {
    saveWorkspace,
}