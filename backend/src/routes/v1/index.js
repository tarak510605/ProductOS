const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
