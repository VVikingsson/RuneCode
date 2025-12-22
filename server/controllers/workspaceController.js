const { Workspace } = require('../models');
const mongoose = require('mongoose');

async function saveWorkspace(req, res, next) {
    try {
        const challId = req.params.challId;
        const userId = req.user.id;
        const {pythonCode, javascriptCode} = req.body;
        for (const objectId of [challId, userId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        let workspace = await Workspace.findOne({challenge: challId, user: userId});
        if (!workspace) {
            workspace = await Workspace.create({
                challenge: challId, 
                user: userId,
                pythonCode: pythonCode, 
                javascriptCode: javascriptCode
            });
            return res.status(201).json({message: 'Successfully created workspace', workspace: workspace});
        }
        workspace.pythonCode = pythonCode;
        workspace.javascriptCode = javascriptCode;
        await workspace.save();
        return res.status(200).json({message: 'Successfully updated workspace', workspace: workspace});
    } catch (err) {
        next(err);
    }
}

async function getPersonalWorkspace(req, res, next) {
    try {
        const challId = req.params.challId;
        const userId = req.user.id;
        for (const objectId of [challId, userId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        let workspace = await Workspace.findOne({challenge: challId, user: userId});
        if (!workspace) {
            return res.status(404).json({
                message: `Not found: No workspace exists for given user (${userId}) and challenge (${challId})`
            });
        }
        return res.status(200).json(workspace);
    } catch (err) {
        next(err);
    }
}

async function deleteWorkspace(req, res, next) {
    try {
        const challId = req.params.challId;
        const userId = req.user.id;
        for (const objectId of [challId, userId]) {
            if (!mongoose.isValidObjectId(objectId)) {
                return res.status(400).json({
                    message: `Bad request: Not a valid MongoDB object ID: ${objectId}`
                });
            }
        }
        let workspace = await Workspace.findOneAndDelete({challenge: challId, user: userId});
        if (!workspace) {
            return res.status(404).json({
                message: `Not found: No workspace exists for given user (${userId}) and challenge (${challId})`
            });
        }
        return res.status(204).json({deleted: workspace});
    } catch (err) {
        next(err);
    }
}

module.exports = {
    saveWorkspace,
    getPersonalWorkspace,
    deleteWorkspace
}