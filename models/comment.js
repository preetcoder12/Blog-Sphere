const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true }, // This is the crucial line
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming you have a User model
    blogid: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },   // Assuming you have a Blog model
    // ... other fields (timestamps, etc.) ...
}, { timestamps: true }); // Include timestamps for created/updated

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;