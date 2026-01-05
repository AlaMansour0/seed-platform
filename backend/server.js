const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// استيراد Routes
const productRoutes = require('./routes/products');
const postRoutes = require('./routes/posts');

// الاتصال بقاعدة البيانات
connectDB();

// تهيئة Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// خدمة الملفات الثابتة (Frontend)
app.use(express.static('../frontend'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes);

// Route للصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../frontend' });
});

// Routes للصفحات الأخرى
app.get('/guide', (req, res) => {
    res.sendFile('guide.html', { root: '../frontend' });
});

app.get('/marketplace', (req, res) => {
    res.sendFile('marketplace.html', { root: '../frontend' });
});

app.get('/blog', (req, res) => {
    res.sendFile('blog.html', { root: '../frontend' });
});

// Route لاختبار API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        message: 'Seed Platform API is running',
        timestamp: new Date().toISOString()
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Frontend served from: ../frontend`);
    console.log(`🗄️  MongoDB Atlas: Connected`);
});