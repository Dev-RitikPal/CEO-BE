const { connectToDatabase } = require("../utils/mongooseConnnection");
const { User } = require("../models/User");
const jwt = require('jsonwebtoken');

/**
 * Generates new access token using refresh token
 */
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();
    console.log("Database connection established");

    const { refreshToken } = event.arguments;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user and check if refresh token matches
    const user = await User.findOne({ 
      _id: decoded._id,
      refreshToken: refreshToken
    });

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    // Generate new tokens
    const token = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();
    await user.save();

    return {
      token,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    console.error("Error processing request:", error);
    if (error.name === 'JsonWebTokenError') {
      throw new Error("Invalid refresh token");
    }
    throw new Error(error.message);
  }
}; 