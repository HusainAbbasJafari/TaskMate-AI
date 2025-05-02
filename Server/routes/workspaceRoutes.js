const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../Middlewares/Auth'); // Ensure the path is correct

// Use the existing ensureAuth middleware
const { 
  createWorkspace, 
  addUserToWorkspace, 
  getWorkspaces, 
  getWorkspaceByAdmin, 
  getAllWorkspacesForUser 
} = require('../Controllers/WorkspaceController');



// router.post('/create', ensureAuth, createWorkspace);
// router.post('/:id/add-users', ensureAuth, addUserToWorkspace);
// router.get('/my-workspaces', ensureAuth, getWorkspaces);
// router.get('/admin-workspace', ensureAuth, getWorkspaceByAdmin);
// router.get('/all-workspaces', ensureAuth, getAllWorkspacesForUser); // 
// Create a new workspace
router.post('/create', ensureAuth, createWorkspace);

// Add users to a workspace
router.put('/:id/add-users', ensureAuth, addUserToWorkspace);

// Get workspaces for a user
router.get('/my-workspaces', ensureAuth, getWorkspaces);

// Get workspace whose admin is the user
router.get('/admin-workspace', ensureAuth, getWorkspaceByAdmin);

// Get all workspaces where the user is either an admin or a member
router.get('/all-workspaces', ensureAuth, getAllWorkspacesForUser);

module.exports = router;