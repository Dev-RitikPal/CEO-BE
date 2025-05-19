const { connectToDatabase } = require("../utils/mongooseConnection");
const { User } = require("../models/User");

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
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Validate password using bcrypt
    // const isValidPassword = await user.validatePassword(password);
    // if (!isValidPassword) {
    //   throw new Error("Invalid email or password");
    // }

    if(user.password !== password){
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    await user.save(); // Save to store refresh token
    
    callback(null, {
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        token,
        refreshToken
      }
    });
  
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error(error.message);
  }
}; 