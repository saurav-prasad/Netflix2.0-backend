const jwt = require('jsonwebtoken')
const JWT_SECRET = "ThisIsSecret"

const fetchUser = (req, res, next) => {
    let success
    // get user token
    const token = req.header('auth-token')
    if (!token) {
        success = false
        return res.status(401).send({ success, message: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        console.log("Verification token +>", data);
        req.user = data.user
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send({ success: false, message: "Please authenticate using a valid token" })
    }
}
module.exports = fetchUser