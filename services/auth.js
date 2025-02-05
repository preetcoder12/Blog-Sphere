const jwt = require("jsonwebtoken");

const secret = "$uperm@n123";

function createToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImg: user.profileImg,
        roles: user.roles,

    };
    const token = jwt.sign(payload, secret);
    return token;

}

function validateToken(token) {
    const payload = jwt.verify(token, secret);
    return payload;

}

module.exports = {
    createToken,
    validateToken,
}