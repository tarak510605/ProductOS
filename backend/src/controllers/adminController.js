const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { deleteCacheByPattern } = require('../services/cacheService');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

const deleteAllUsers = asyncHandler(async (req, res) => {
  const currentAdminId = req.user._id;
  await Product.deleteMany({});
  const result = await User.deleteMany({ _id: { $ne: currentAdminId } });
  await deleteCacheByPattern('products:*');

  res.status(200).json({
    success: true,
    message: 'All users except current admin deleted',
    deletedCount: result.deletedCount
  });
});

module.exports = {
  getAllUsers,
  deleteAllUsers
};
