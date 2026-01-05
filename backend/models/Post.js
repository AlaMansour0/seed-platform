const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان التجربة مطلوب'],
        trim: true,
        maxlength: [200, 'لا يمكن أن يزيد العنوان عن 200 حرف']
    },
    content: {
        type: String,
        required: [true, 'محتوى التجربة مطلوب'],
        maxlength: [2000, 'لا يمكن أن يزيد المحتوى عن 2000 حرف']
    },
    author: {
        type: String,
        required: [true, 'اسم الكاتب مطلوب'],
        trim: true
    },
    plantType: {
        type: String,
        trim: true
    },
    experienceType: {
        type: String,
        enum: ['success', 'failure', 'tip', 'question'],
        default: 'tip'
    },
    likes: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w-400&h=300&fit=crop'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);