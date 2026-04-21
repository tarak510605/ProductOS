const asyncHandler = require('../utils/asyncHandler');
const { registerUser, loginUser } = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const payload = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: payload
  });
});

const login = asyncHandler(async (req, res) => {
  const payload = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: payload
  });
});

const profile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

module.exports = {
  register,
  login,
  profile
};
