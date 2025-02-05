const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blogs")
const router = Router();

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
    return res.redirect(`/`);
})

module.exports = router;
