const { connectToDatabase } = require("../utils/mongooseConnection");
const { User } = require("../models/User");

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
  const { firstName, lastName, password, role, city, phone, location, email } = event.arguments.input;

  try {
    await connectToDatabase();
    console.log("Database connection established");

    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }
    console.log("🚀 ~ module.exports.handler= ~ user:", user)

    user = await User.create({ 
      firstName, 
      lastName, 
      password, 
      role, 
      city, 
      phone, 
      location,
      email 
    });

    if (!user) {
      throw new Error("User not created");
    }

    // Generate initial tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    await user.save();

    return {
      message: "User created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
        location: user.location
      },
      token,
      refreshToken
    };
  } catch (error) {
    throw new Error(error.message);
  }
};