const {workspaceController} = require('../controllers');
const express = require('express');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

router.put('', authenticateToken, workspaceController.saveWorkspace); // Done
router.get('', authenticateToken, workspaceController.getPersonalWorkspace); // Done
router.delete('', authenticateToken, workspaceController.deleteWorkspace); // Done

module.exports = router;