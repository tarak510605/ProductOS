const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { deleteCacheByPattern } = require('../services/cacheService');

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    owner: req.user._id
  });

  await deleteCacheByPattern('products:*');

  res.status(201).json({
    success: true,
    message: 'Product created',
    data: product
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { owner: req.user._id };
  const products = await Product.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (req.user.role !== 'admin' && product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (req.user.role !== 'admin' && product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  Object.assign(product, req.body);
  await product.save();

  await deleteCacheByPattern('products:*');

  res.status(200).json({
    success: true,
    message: 'Product updated',
    data: product
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (req.user.role !== 'admin' && product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }

  await product.deleteOne();

  await deleteCacheByPattern('products:*');

  res.status(200).json({
    success: true,
    message: 'Product deleted'
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
