const {validateToken} = require("../services/auth")

function checkForAuthentication(cookie_name) {


    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookie_name];

        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            console.error("Token validation failed:", error);
        }
        next();
    }

}

module.exports = {
    checkForAuthentication,
}