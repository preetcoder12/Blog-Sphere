const express = require("express");
const path = require("path");
const userroutes = require('./routes/users')
const mongoose = require("mongoose");


mongoose.connect('mongodb://127.0.0.1:27017/blogsphere')
    .then(() => console.log("MongoDB connected"))

const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.set('views', path.resolve('./views'))
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    console.log("homepage");
    return res.render("home");
})

app.use('/user', userroutes);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})


