const { Schema, model } = require("mongoose");

const blogschema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user" //now by defalut this createdBY point towards users schema
    },
}, { timestamps: true });

const Blog = model('blog', blogschema);

module.exports = Blog;
