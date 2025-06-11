const { connectToDatabase } = require("../utils/mongooseConnection");
const Workspace = require("../schema/addWorkspace");

/**
 * Lambda function to add a new project
 * @param {Object} event - The event object from AWS Lambda
 * @param {Object} context - The context object from AWS Lambda
 * @param {Function} callback - The callback function
 */
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));
  const { input } = event.arguments;

  try {
    await connectToDatabase();
    console.log("Database connection established");

    const workspace = new Workspace(input);

    const  res = await workspace.save();
    
    callback(null, {
      message: "Workspace added successfully",
      workspace: res
    });

  } catch (error) {
    console.error("Error adding project:", error);
    throw new Error(error.message);
  }
};
