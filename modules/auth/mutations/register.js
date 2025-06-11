const { connectToDatabase } = require("../utils/mongooseConnection");
const { Organization } = require("../models/register");

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

module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();
    console.log("Database connection established");
    const { basicDetails, businessAddress } = event.arguments.input;

    let org = await Organization.find({
      "basicDetails.companyName": basicDetails.companyName,
      "businessAddress.mailingAddress": businessAddress.mailingAddress,
    });
    
    if (org.length !== 0) {
      throw new Error("Organization already exists");
    }

    org = await Organization.create(event.arguments.input);

    if (!org) {
      throw new Error("Organization not registered");
    }

    // Generate initial tokens
    const token = org.generateAuthToken();
    const refreshToken = org.generateRefreshToken();
    await org.save();

    return {
      message: "Organization registered successfully",
      orgDetails: org,
      token,
      refreshToken,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
