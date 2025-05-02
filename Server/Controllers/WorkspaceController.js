const Workspace = require('../Models/Workspace');
const User = require('../Models/User');

// Create a new workspace
const createWorkspace = async (req, res) => {
  console.log(req.user);
  try {
    const workspace = new Workspace({
      name: req.body.name,//workspace name
      admin: [req.user._id], 
      members: [req.user._id],
    });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add users to a workspace
const addUserToWorkspace = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging
    console.log("Workspace ID:", req.params.id); // Debugging

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if the user making the request is an admin
    if (!workspace.admin.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const userIds = req.body.userIds; // Expecting an array of user IDs
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // Add users to the workspace
    userIds.forEach((userId) => {
      if (!workspace.members.includes(userId)) {
        workspace.members.push(userId);
      }
    });

    await workspace.save();
    res.status(200).json(workspace);
  } catch (err) {
    console.error("Error adding users to workspace:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get workspaces for a user
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ admin: req.user._id });//
    res.status(200).json(workspaces);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// get workspace whose admin is the user

const getWorkspaceByAdmin = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ admin: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.status(200).json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });    
  }
};

// get all workspaces where the user is either an admin or a member
const getAllWorkspacesForUser = async (req, res) => {
  try {
    console.log("User ID:", req.user._id); // Debugging
    const workspaces = await Workspace.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    });
    console.log("Workspaces Found:", workspaces); // Debugging
    res.status(200).json(workspaces);
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  createWorkspace, 
  addUserToWorkspace, 
  getWorkspaces, 
  getWorkspaceByAdmin, 
  getAllWorkspacesForUser // Export the new function
};