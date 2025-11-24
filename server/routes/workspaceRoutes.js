const {workspaceController} = require('../controllers');
const express = require('express');

const router = express.Router();

router.put('', workspaceController.saveWorkspace);
router.get('')