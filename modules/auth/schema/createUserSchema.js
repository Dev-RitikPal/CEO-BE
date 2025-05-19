const { Schema } = require("mongoose");
const { model } = require("mongoose");

const CreateUserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
});

module.exports = model("User", CreateUserSchema);