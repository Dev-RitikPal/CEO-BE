let mongoose = require('mongoose');

const MAX_POOL_SIZE = 25;

let cachedDb = null;
const MONGODB_URI_SSM = process.env.MONGODB_URI_SSM;
const MONGODB_DB_NAME_SSM = process.env.MONGODB_DB_NAME_SSM;
const maxPoolSize = MAX_POOL_SIZE;

/**
 * Establishes a connection to MongoDB using Mongoose with connection pooling.
 * Uses environment variables for MongoDB connection details.
 * Caches the database connection for subsequent use.
 *
 * @returns {Promise<mongoose.Connection>} Mongoose connection object.
 * @throws {Error} If environment variables MONGODB_URI_SSM or MONGODB_DB_NAME_SSM are missing.
 */
module.exports.connectToDatabase = async (mongooseInstance = null) => {
  if (mongooseInstance) {
    mongoose = mongooseInstance;
  }

  if (!mongoose) {
    throw new Error("Mongoose library is not available");
  }

  if (!MONGODB_URI_SSM || !MONGODB_DB_NAME_SSM) {
    throw new Error("MongoDB connection details are missing from environment variables");
  }

  // Return the cached database connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    // If the connection is not established or is disconnected, create a new connection
    if (mongoose.connection.readyState !== 1) {
      cachedDb = await mongoose.connect(MONGODB_URI_SSM, {
        serverSelectionTimeoutMS: 30000,
        dbName: MONGODB_DB_NAME_SSM,
        maxPoolSize: parseInt(maxPoolSize),
      });

      mongoose.connection.on("error", error => {
        console.error("MongoDB connection error:", error);
        cachedDb = null; // Clear the cache on error
      });

      mongoose.connection.once("open", () => {
        console.log("Connected to MongoDB database");
      });
    } else {
      cachedDb = mongoose.connection;
    }

    return cachedDb;
  } catch (error) {
    console.error("Error establishing MongoDB connection:", error);
    cachedDb = null; // Clear the cache on error
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};
