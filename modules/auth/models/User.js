const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  city: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  refreshToken: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generate auth token
userSchema.methods.generateAuthToken = function() {
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
userSchema.methods.generateRefreshToken = function() {
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
userSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Create and export the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = { User }; 