const { connectToDatabase } = require("../utils/mongooseConnection.js")
const { User } = require("../models/register.js");
// import jwt from 'jsonwebtoken';

/**
 * Returns the current authenticated user
 */
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2), event);
  const { _id } = event.arguments;

  try {
    await connectToDatabase();
    console.log("Database connection established");

    // // Get user ID from authorization header
    // const authHeader = event.request.headers.authorization;
    // if (!authHeader) {
    //   throw new Error("Authorization header missing");
    // }

    // const token = authHeader.replace('Bearer ', '');
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    const { firstName, lastName, email, role, city, phone, location } =
      user;

    callback(null, {
      message: "User fetched successfully",
      user: {
        _id: user._id,
        firstName,
        lastName,
        email,
        role,
        city,
        phone,
        location,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error(error.message);
  }
};
