const {workspaceController} = require('../controllers');
const express = require('express');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

router.put('', authenticateToken, workspaceController.saveWorkspace);
router.get('', authenticateToken, workspaceController.getPersonalWorkspace);
router.delete('', workspaceController.deleteWorkspace);

module.exports = router;