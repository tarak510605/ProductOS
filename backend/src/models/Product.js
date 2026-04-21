const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    category: {
      type: String,
      trim: true,
      maxlength: 100
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
