const express = require('express');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../util/sendEmail');

// Generate a JWT token for the user
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h' // expires in 1 hr
    });
};

// Register user
let userController = {
    userRegister: async function (req, res) {
        try {
            console.log(req);
            let { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ message: "feild required" });
            }

            //check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "invalid email format" });
            }

            //check password length
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            const user = new User({ username, email, password });
            await user.save();
            res.status(201).json({ message: 'user created...' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },

    login: async function (req, res) {
        try {
            const { email, password } = req.body;
            console.log(email);
            const user = await User.findOne({ email });  // check email is exist or not
            //check or compare the password 
            if (!user || !(await bcryptjs.compare(password, user.password))) {
                return res.status(401).json({ message: 'invalid email or password' });
            }
            // Generate a JWT token for the authenticated user
            const token = generateToken(user);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    forgetPass: async function (req, res) {
        try {
            const { email } = req.body;
            console.log(email);
            const user = await User.findOne({ email }); // user by email
            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            }
            // generate random reset token
            const resetToken = crypto.randomBytes(20).toString('hex');

            // reset token and set exp. time
            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            // save the user with updated reset token
            await user.save();
            // create reset URL for email
            const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPass/${resetToken}`;
            // email message
            const message = `Password reset. Please go to the link to reset your password: ${resetUrl}`;
            // send email to the user with the reset link
            await sendEmail({
                email: user.email,
                subject: 'Password Reset',
                message,
            });
            res.status(200).json({ message: 'Email sent', resetToken: resetToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    setPassword: async function (req, res) {
        try {
            const { resetToken } = req.params;
            const { password } = req.body;
            // check if reset token or password
            if (!resetToken || !password) {
                return res.status(400).json({ message: 'Invalid or paasowrd reset token required' });
            }

            // hash the reset token match with hashed token in database
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            // check user with match hashed reset token and confirm token has not expired or not
            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() }, // check if token has not expired
            });
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }
            // updtate the user's password
            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    getUserDetails: async function (req, res) {
        try {
            const user = await User.findById(req.user.id)  // get user details
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateUser: async function (req, res) {
        try {
            const data = req.body;
            // find the user by id 
            const user = await User.findByIdAndUpdate(req.user.id, data, {
                new: true,            // return the updated document of original data
                runValidators: true,  // run schema validators on updated document
            });
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = userController;
