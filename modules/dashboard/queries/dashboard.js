const { connectToDatabase } = require("../utils/mongooseConnection.js")
const { User } = require("../models/register.js");
// import jwt from 'jsonwebtoken';

/**
 * Returns the current authenticated user
 */
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2), event);

  try {
    await connectToDatabase();
    console.log("Database connection established");

    callback(null, {
      message: "Dashboard fetched successfully"
    });
  } catch (error) {
    console.error("Error processing request:", error);
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error(error.message);
  }
};
