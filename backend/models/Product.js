const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم المنتج مطلوب'],
        trim: true,
        maxlength: [100, 'لا يمكن أن يزيد الاسم عن 100 حرف']
    },
    type: {
        type: String,
        required: [true, 'نوع المنتج مطلوب'],
        enum: {
            values: ['seeds', 'seedlings', 'produce', 'tools'],
            message: '{VALUE} ليس نوع منتج صالح'
        }
    },
    description: {
        type: String,
        maxlength: [500, 'لا يمكن أن يزيد الوصف عن 500 حرف']
    },
    price: {
        type: String,
        required: [true, 'السعر أو الحالة مطلوبة']
    },
    city: {
        type: String,
        required: [true, 'المدينة مطلوبة'],
        trim: true
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop'
    },
    contact: {
        type: String,
        required: [true, 'طريقة التواصل مطلوبة']
    },
    status: {
        type: String,
        enum: ['available', 'taken', 'sold'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);