const mongoose = require('mongoose');
const { Schema } = mongoose;

const WorkspaceSchema = new Schema({
  workspaceName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  workspaceType: {
    type: String,
    enum: ['engineering', 'design', 'marketing', 'general'],
    default: 'general'
  },
  tags: [{
    type: String
  }],
  defaultPermissions: {
    type: Object,
    default: {}
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);
