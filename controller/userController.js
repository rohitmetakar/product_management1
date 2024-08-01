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

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "invalid email format" });
            }

            // Validate password length
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

            const user = await User.findOne({ email });

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

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const resetToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            console.log(user.resetPasswordToken);
            console.log(user.resetPasswordExpires);

            await user.save();
            const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPass/${resetToken}`;
            const message = `Password reset. Please go to this link to reset your password: ${resetUrl}`;
            await sendEmail({
                email: user.email,
                subject: 'Password Reset',
                message,
            });
            res.status(200).json({ message: 'Email sent', resetPasswordToken: resetToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    setPassword: async function (req, res) {
        try {
            const { resetToken } = req.params;
            const { password } = req.body;
            console.log();
            if (!resetToken || !password) {
                return res.status(400).json({ message: 'Invalid or missing reset token or password' });
            }
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() },
            });
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

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
            const user = await User.findById(req.user.id).select('-password');
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateUser: async function (req, res) {
        try {
            const data = req.body;
            const user = await User.findByIdAndUpdate(req.user.id, data, {
                new: true,
                runValidators: true,
            }).select('-password');
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = userController;
