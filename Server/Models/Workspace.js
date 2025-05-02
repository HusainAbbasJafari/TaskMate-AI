// workspace schema
const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  admin: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

 members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;