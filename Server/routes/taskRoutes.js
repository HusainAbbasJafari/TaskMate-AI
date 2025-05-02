// taskRoute.js is a route file that contains all the routes for the task model.

const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../Middlewares/Auth');
const { createTask, assignUsersToTask, getTasks, updateTask, deleteTask, dragTask, getTaskDetails, getTasksByWorkspace, updateTaskStatus } = require('../Controllers/TaskController');

// Create a new task
router.post('/', ensureAuth, createTask);

// Assign users to a task
router.put('/:id/assignUsers', ensureAuth, assignUsersToTask);

// Get tasks for a workspace
router.get('/:workspaceId', ensureAuth, getTasks);

// Get tasks by workspaceId
router.get('/', ensureAuth, getTasksByWorkspace);

// get single task by id
router.get('/:id/details', ensureAuth, getTaskDetails)

// Update a task
router.put('/:id', ensureAuth, updateTask);

router.put('/:id/drag', ensureAuth, dragTask);

// Update task status
router.put('/:id/update-status', ensureAuth, updateTaskStatus);

// Delete a task
router.delete('/:id', ensureAuth, deleteTask);

module.exports = router;