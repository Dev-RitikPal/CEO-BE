const { connectToDatabase } = require("../utils/mongooseConnnection");
const { User } = require("../models/User");
const jwt = require('jsonwebtoken');

/**
 * Invalidates refresh token
 */
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();
    console.log("Database connection established");

    // Get user ID from authorization header
    const authHeader = event.request.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Clear refresh token
    await User.updateOne(
      { _id: decoded._id },
      { $unset: { refreshToken: 1 } }
    );

    return true;
  } catch (error) {
    console.error("Error processing request:", error);
    if (error.name === 'JsonWebTokenError') {
      throw new Error("Invalid token");
    }
    throw new Error(error.message);
  }
}; 