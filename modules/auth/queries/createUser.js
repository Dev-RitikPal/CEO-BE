const { connectToDatabase } = require("../utils/mongooseConnnection");

/**
 * Lambda function handler to create user.
 *
 * This function performs the following steps:
 * 1. Logs the received event data.
 * 2. Establishes a connection to the MongoDB database.
 * 3. Returns a success message.
 *
 * @param {Object} event - The event object containing the input arguments.
 * @param {Object} context - The context object provided by AWS Lambda.
 * @returns {Promise<Object>} - Returns a promise that resolves to the response object.
 */
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();
    console.log("Database connection established");

    return {
      message: "Query called successfully"
    };
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error(error.message);
  }
};
