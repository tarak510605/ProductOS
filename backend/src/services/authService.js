const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const buildToken = ({ id, role }) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'admin' : 'user';
  const user = await User.create({ name, email, password, role });
  const token = buildToken({ id: user._id, role: user.role });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = buildToken({ id: user._id, role: user.role });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};
