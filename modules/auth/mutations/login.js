const { connectToDatabase } = require("../utils/mongooseConnection");
const { Register } = require("../models/register");

/**
 * Authenticates a user and returns tokens
 */
module.exports.handler = async (event, context,callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();
    console.log("Database connection established");

    const { email, password } = event.arguments;

    // Find user by email
    const org = await Register.findOne({
      "businessAddress.mailingAddress": email,
    });

    if (!org) {
      throw new Error("Invalid email or password");
    }

    // Validate password using bcrypt
    const isValidPassword = await org.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const token = org.generateAuthToken();
    const refreshToken = org.generateRefreshToken();
    await org.save(); // Save to store refresh token
    
    callback(null, {
      message: "Login successful",
      user: {
        _id: org._id,
        email: org.businessAddress.mailingAddress,
        token,
        refreshToken
      }
    });
  
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error(error.message);
  }
}; 