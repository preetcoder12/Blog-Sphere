require('dotenv').config()
const express = require("express");
const path = require("path");
const userroutes = require('./routes/users')
const blogRoutes = require('./routes/blog')
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const { checkForAuthentication } = require('./middleware/auth')


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))

const PORT = process.env.PORT||8000;  //process.env.PORT provide dynamic  ports to sers when we Host it onlin 

const app = express();
app.set("view engine", "ejs");
app.set('views', path.resolve('./views'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure JSON parsing
app.use(cookieparser());
app.use(checkForAuthentication("token"))
app.use(express.static(path.resolve('./public')))//as we know that nodejs takes address of images url so to make it static we use express.static

const Blog = require("./models/blogs")

app.get('/', async (req, res) => {
    const allblogs = await Blog.find({});
    return res.render("home", {
        user: req.user || null,
        blogs: allblogs,
    });
});

app.get('/user/logout', (req, res) => {
    res.clearCookie("token").redirect('/user/signin')
})

app.use('/user', userroutes);
app.use('/blog', blogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})


