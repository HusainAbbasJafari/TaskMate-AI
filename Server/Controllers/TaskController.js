// TaskController.js
const Task = require('../Models/Task');
const Workspace = require('../Models/Workspace');

// Create a new task
const createTask = async (req, res) => {
  try {
    // workspace should be admin workspace
    const workspace = await Workspace.findById(req.body.workspace);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const task = new Task({
      ...req.body,
      assignedTo: [...req.body.assignedTo ,req.user._id],
      createdBy: req.user._id, //
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
};

// Assign users to a task
const assignUsersToTask = async (req, res) => {
 
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    task.assignedTo = [...task.assignedTo, ...req.body.userIds];//assign users[array of ids]
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
};

// Get tasks for a workspace
const getTasks = async (req, res) => {

  try {
    const tasks = await Task.find({ workspace: req.params.workspaceId });//workspace id
    if(tasks.length === 0){
      return res.status(404).json({ message: 'No tasks found' });
    }
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
};

// getTaskDetails

const getTaskDetails = async(req, res)=>{
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email'); // \
    // populate assignedTo field with user details
    console.log(task,"taskDetailbacked")
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
}
// drag a task

const dragTask = async (req,res)=>{
  console.log(req.body,"drag body")
  console.log(req.params.id,"drag params id")
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.status = req.body.newStatus;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
}

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const workspace = await Workspace.findById(task.workspace);
    // fix here after lunch 404 forbidden
    if (!workspace.members.includes(req.user._id)  || !task.assignedTo.includes(req.user._id)) { //check if user is workspace member or task assignee
      return res.status(403).json({ message: 'Not authorized' });
    }
      
    if (req.body.assignedTo) {
      console.log("Before merging:", task.assignedTo, req.body.assignedTo);
      task.assignedTo = Array.isArray(req.body.assignedTo)
  ? [...new Set([...task.assignedTo.map(String), ...req.body.assignedTo.map(String)])]
  : task.assignedTo; // Merge the existing assignedTo with the new assignedTo
        console.log("After merging:", task.assignedTo);
      delete req.body.assignedTo; // Remove assignedTo from the body to avoid overwriting
    }

    Object.assign(task, req.body); // Update other fields
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
};

// Get tasks by workspaceId
const getTasksByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.query; // Extract workspaceId from query parameters
    if (!workspaceId) {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }

    const tasks = await Task.find({ workspace: workspaceId }); // Fetch tasks for the workspace
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting Task ID:", id); // Debugging
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params; // Task ID
    const { status } = req.body; // New status

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated task
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, assignUsersToTask, getTasks, updateTask, deleteTask,dragTask,getTaskDetails, getTasksByWorkspace, updateTaskStatus };