const { body, param } = require('express-validator');

const productIdValidator = [param('id').isMongoId().withMessage('Invalid product id')];

const createProductValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
  body('category').optional().trim().isLength({ max: 100 }).withMessage('Category too long')
];

const updateProductValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('inStock').optional().isBoolean().withMessage('inStock must be boolean'),
  body('category').optional().trim().isLength({ max: 100 }).withMessage('Category too long')
];

module.exports = {
  productIdValidator,
  createProductValidator,
  updateProductValidator
};
