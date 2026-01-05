const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// GET جميع المنتجات
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET منتجات حسب المدينة
router.get('/city/:city', async (req, res) => {
    try {
        const products = await Product.find({ city: req.params.city });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST إضافة منتج جديد
router.post('/',
    [
        body('name').notEmpty().trim().escape(),
        body('type').isIn(['seeds', 'seedlings', 'produce', 'tools']),
        body('price').notEmpty(),
        body('city').notEmpty().trim(),
        body('contact').notEmpty().trim()
    ],
    async (req, res) => {
        // التحقق من صحة البيانات
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(201).json({
                success: true,
                message: 'تمت إضافة المنتج بنجاح',
                product: newProduct
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

// GET منتج بواسطة ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'المنتج غير موجود' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE حذف منتج
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'المنتج غير موجود' });
        }
        res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;