const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkspaceSchema = new Schema(
  {
    workspaceName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    workspaceType: {
      type: String,
      enum: [
        "software development",
        "design",
        "marketing",
        "general",
        "product",
        "sales",
        "finance",
        "hr",
        "operations",
        "support",
        "HR & recruitment",
        "it",
        "startup",
        "other",
      ],
      default: "general",
    },
    tags: [
      {
        type: String,
      },
    ],
    tools: [
      {
        type: [String],
        enum: [
          "chatgpt",
          "notion",
          "google docs",
          "google calendar",
          "google drive",
          "Jira",
          "Zoom",
          "Figma",
          "Todoist",
          "MS Teams",
          "Slack",
          "Confluence",
          "Excel & CSV",
          "GitHub",
          "google meet",
          "Trello",
          "Google Drive",
        ],
      },
    ],
    features: [
      {
        type: [String],
        enum: [
          "Tasks & Projects",
          "Calendar",
          "Ask AI",
          "Chat",
          "project management",
          "reporting",
          "security",
          "storage",
          "Boards",
          "CRM",
          "Time Tracking",
          "Forms",
        ],
      },
    ],
    defaultPermissions: {
      type: [Object],
      default: {},
    },
    type: {
      type: String,
      enum: ["organization", "personal", "school", "business"],
      default: "organization",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Workspace", WorkspaceSchema);
