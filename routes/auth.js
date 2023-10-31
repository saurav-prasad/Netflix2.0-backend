const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router()
const { body, validationResult } = require("express-validator")
const JWT_SECRET = 'ThisIsSecret'
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Route 1: create a user => POST /api/createuser Doesnot require login
router.post('/createuser',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('name', 'Name should be atleast of 3 characters long').isLength({ min: 3 }),
        body('password', 'Password should be atleast of 6 characters long').isLength({ min: 6 })
    ],
    async (req, res) => {
        let success

        // check if there are any errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            success = false
            return res.status(400).json({ success, message: errors.array()[0].msg })
        }
        try {
            const { email, password, name } = req.body

            // check if the user with the email already exist
            let user = await User.findOne({ email: email })
            if (user) {
                success = false
                return res.status(400).json({ success, message: "User with this email already exist" })
            }

            // hashing password
            const salt = await bcrypt.genSalt(10)
            const securePassword = await bcrypt.hash(password, salt)

            // adding the user to database
            user = await User.create({
                name: name,
                email: email,
                password: securePassword
            })

            const data = {
                user: {
                    userId: user.id,
                }
            }

            // token generation
            success = true
            const token = await jwt.sign(data, JWT_SECRET)
            console.log(token);
            console.log(user);

            res.send({ success, data: user, message: "User created", authToken: token })
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: 'Internal server error occurred' })
        }

    }
)


// Route 2: login a user => POST /api/loginuser Doesnot require login
router.post('/loginuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be atleast of 6 characters long').isLength({ min: 6 })
],
    async (req, res) => {
        console.log("request",req.body);
        let success
        const error = validationResult(req)
        if (!error.isEmpty()) {
            success = false;
            return res.status(400).send({ message: error.array()[0].msg, success })
        }
        try {
            const { email, password } = req.body

            // check if the user with the email exist
            let user = await User.findOne({ email })
            if (!user) {
                success = false
                return res.status(400).send({ message: "User with this email not found", success })
            }

            // matching password
            const matchPassword = await bcrypt.compare(password, user.password)
            if (!matchPassword) {
                success = false
                return res.status(400).send({ message: "Password didn't matched", success })
            }

            // token generation
            const data = {
                user: {
                    userId: user.id,
                }
            }
            const token = await jwt.sign(data, JWT_SECRET)
            success = true
            res.send({ message: "User found", success, user, token: token })
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, message: "Internal server error occurred" })
        }
    }
)


// Route 3: fetch a user => GET /api/fetchuser required login
router.get('/fetchuser', fetchUser,
    async (req, res) => {
        try {
            console.log(req.user);
            const userId = req.user.userId
            // fetch user by userId from database
            let user = await User.findById(userId).select('-password')
            res.send({ user, status: true, message: "User Found", data: user.data })
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error occurred", status: false })
        }
    }
)


module.exports = router