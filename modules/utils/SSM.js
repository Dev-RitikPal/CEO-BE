
const AWS = require("aws-sdk");

const cache = {};
const CACHE_EXPIRY_MS = 60 * 1000; // Cache expiry time in milliseconds

/**
 * Lazily initializes and returns an AWS SSM client.
 * This avoids re-creating the client on each call, improving performance.
 *
 * @returns {AWS.SSM} The initialized AWS SSM client.
 */
function getSSMClient() {
  if (!getSSMClient.ssm) {
    getSSMClient.ssm = new AWS.SSM();
  }
  return getSSMClient.ssm;
}

/**
 * Retrieves the value of an AWS SSM parameter.
 * Uses caching to reduce the number of AWS SSM API calls.
 *
 * @param {string} path The name of the parameter.
 * @returns {Promise<string>} The value of the parameter.
 * @throws {Error} If the AWS SSM API call fails.
 */
async function getSSMPathValue(path) {
  const cachedItem = cache[path];

  // Return cached value if valid
  if (cachedItem && cachedItem.expiry > Date.now()) {
    console.log(`Cache hit for path: ${path}`);
    return cachedItem.value;
  }

  // Fetch the parameter from SSM
  console.log(`Fetching SSM parameter: ${path}`);
  const params = {
    Name: path,
    WithDecryption: true,
  };

  // Initialize SSM client if not already created
  const ssm = getSSMClient();

  try {
    const result = await ssm.getParameter(params).promise();
    const value = result.Parameter.Value;

    // Update the cache with the new value and expiry time
    cache[path] = {
      value,
      expiry: Date.now() + CACHE_EXPIRY_MS,
    };
    console.log(`SSM parameter fetched and cached for path: ${path}`);

    return value;
  } catch (error) {
    console.error(`Failed to fetch SSM parameter for path: ${path}`, error);
    throw error;
  }
}

module.exports = { getSSMPathValue };
