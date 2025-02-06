const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blogs");
const router = Router();
const Comment = require('../models/comment')
const User = require('../models/user'); // Correct path is essential!


router.get('/add_new', (req, res) => {
    return res.render("blog", ({
        user: req.user,
    }));
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/upload`))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
})
const upload = multer({ storage: storage })


router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body

    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImage: `/upload/${req.file.filename}`

    })
    return res.redirect(`/blog/${blog._id}`);
})


router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy'); // lowercase 'c', user
    const comments = await Comment.find({ blogid: req.params.id }); // lowercase 'c', user
    console.log("blog: ",blog); // Log the comments array
    console.log("comments: ",comments); // Log the comments array

    return res.render("readblog", {
        user: req.user,
        blog,
        comments, // Pass the comments array to the template
    });

});
router.post('/comment/:id', async (req, res) => {
    await Comment.create({
        content: req.body.comment, // Correct field name
        createdBy: req.user._id,
        blogid: req.params.id

    })
    res.redirect(`/blog/${req.params.id}`);
})

module.exports = router;
