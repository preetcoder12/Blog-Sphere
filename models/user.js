const { createHmac, randomBytes } = require("crypto")
const { Schema, model, default: mongoose } = require("mongoose");
const { createToken } = require("../services/auth");

const userschema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: './images/defaultimg.png',
    },
    roles: {
        type: String,
        enum: ['USER', "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

userschema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");  // Ensure hex encoding
    const hashedpass = createHmac('sha256', salt).update(user.password).digest('hex');    
    this.salt = salt;
    this.password = hashedpass;
    next();
});


userschema.static("matchpasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("User not found")
    };

    const salt = user.salt;
    const hashedPassword = user.password;
    const userprovidedHashed = createHmac('sha256', salt).update(password).digest("hex");

    if (hashedPassword !== userprovidedHashed) {
        throw new Error("Incorrect email or password");
    }
    
    
    const token = createToken(user);
    return token;
})

const User = mongoose.model("user", userschema);

module.exports = User;