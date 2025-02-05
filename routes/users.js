const { Router } = require("express")
const User = require('../models/user')
const router = Router();

router.get('/signin', (req, res) => {
    return res.render("signin");
})

router.get('/signup', (req, res) => {
    return res.render("signup");
})

router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.render("signup", { error: "All fields are required" });
    }

    try {
        const user = await User.create({
            fullname, // Match the form field 'fullname' with the schema
            email,
            password,
        });
        console.log("User created:", user); // Log the created user for debugging
        return res.redirect('/user/signin');
    } catch (error) {
        console.error("Error creating user:", error); // Log the error
        return res.render("signup", { error: "An error occurred during signup" });
    }
});


router.post('/signin', async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.render("signin", { error: "All fields are required" });
    }
    try {
        const token = await User.matchpasswordAndGenerateToken(email, password);
        console.log("token : ", token)
        return res.cookie("token", token).redirect('/');
    } catch (error) {
        return res.render("signin", { error: "Incorrect email or password" });

    }

})

module.exports = router;