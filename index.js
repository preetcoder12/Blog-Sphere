require('dotenv').config();
const express = require("express");
const path = require("path");
const userroutes = require('./routes/users');
const blogRoutes = require('./routes/blog');
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const { checkForAuthentication } = require('./middleware/auth');

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 8000;  // Process environment variable for dynamic ports

const app = express();

// Set view engine and views folder path
app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

// Middleware for body parsing and cookie parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Ensure JSON parsing
app.use(cookieparser());

// Check for authentication token
app.use(checkForAuthentication("token"));

// Serve static files (e.g., images, stylesheets)
app.use(express.static(path.resolve('./public')));

// Blog model import
const Blog = require("./models/blogs");

// Home route to render all blogs
app.get('/', async (req, res) => {
    try {
        const allblogs = await Blog.find({});
        return res.render("home", {
            user: req.user || null,
            blogs: allblogs,
        });
    } catch (err) {
        console.error("Error fetching blogs:", err);
        return res.status(500).send("Server Error");
    }
});

// User logout route
app.get('/user/logout', (req, res) => {
    res.clearCookie("token").redirect('/user/signin');
});

// Use user and blog routes
app.use('/user', userroutes);
app.use('/blog', blogRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
