const { connectToDatabase } = require("../utils/mongooseConnection");
const { User } = require("../models/register");
const jwt = require("jsonwebtoken");

/**
 * Invalidates refresh token
 */
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();
    console.log("Database connection established");

    // Get user ID from AppSync context
    const authHeader = event.header?.token || event.requestContext?.authorizer?.token;
    if (!authHeader) {
      throw new Error("Authorization token missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Clear refresh token
    await User.updateOne({ _id: decoded._id }, { $unset: { refreshToken: 1 } });

    callback(null, {
      message: "Logout Successfully",
      success: true
    });
  } catch (error) {
    console.error("Error processing request:", error);
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error(error.message);
  }
};
