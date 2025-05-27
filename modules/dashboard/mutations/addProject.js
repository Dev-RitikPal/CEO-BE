const { connectToDatabase } = require("../utils/mongooseConnection");
const Project = require("../schema/projects");

/**
 * Lambda function to add a new project
 * @param {Object} event - The event object from AWS Lambda
 * @param {Object} context - The context object from AWS Lambda
 * @param {Function} callback - The callback function
 */
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();
    console.log("Database connection established");

    const { input } = event.arguments;

    // Validate required fields
    const requiredFields = [
      'project_name',
      'client',
      'assigned_to',
      'technology',
      'type',
      'businessDeveloper',
      'phone',
      'status',
      'onboarding_date',
      'equipments_by',
      'project_manager',
      'project_description',
      'reporting_to',
      'shadow_developer',
      'end_date',
      'location',
      'remarks'
    ];

    for (const field of requiredFields) {
      if (!input[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate client object fields
    const requiredClientFields = ['name', 'phone', 'email', 'contact_person'];
    for (const field of requiredClientFields) {
      if (!input.client[field]) {
        throw new Error(`Missing required client field: ${field}`);
      }
    }

    // Validate type enum
    const validTypes = ['outSource', 'contract', 'employee', 'internal'];
    if (!validTypes.includes(input.type)) {
      throw new Error(`Invalid project type. Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate status enum
    const validStatuses = ['active', 'inactive', 'completed', 'cancelled'];
    if (!validStatuses.includes(input.status)) {
      throw new Error(`Invalid project status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Create new project
    const project = new Project(input);
    await project.save();

    return {
      message: "Project added successfully",
      project: project
    };

  } catch (error) {
    console.error("Error adding project:", error);
    throw new Error(error.message);
  }
};
