const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerSchema = new mongoose.Schema({
  basicDetails: {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    legalEntityType: {
      type: String,
      required: true,
      trim: true
    },
    businessDescription: {
      type: String,
      required: true,
      trim: true
    },
    industrySector: {
      type: String,
      required: true,
      trim: true
    },
  },
  businessAddress: {
    registeredOfficeAddress: {
      type: String,
      required: true,
      trim: true
    },
    mailingAddress: {
      type: String,
      required: true,
      trim: true
    },
    stateProvince: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
  },
  contactDetails: {
    contactPerson: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  
}, { timestamps: true });

// Hash password before saving
registerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generate auth token
registerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { 
      _id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

// Generate refresh token
registerSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign(
    { 
      _id: this._id,
      email: this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  this.refreshToken = refreshToken;
  return refreshToken;
};

// Validate password
registerSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Create and export the model
const Organization = mongoose.models.Register || mongoose.model('Organization', registerSchema);

module.exports = { Organization };