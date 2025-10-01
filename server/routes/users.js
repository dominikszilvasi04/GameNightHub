const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json({ msg: 'User registered successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // Note: We send a generic error for security
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 2. Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 3. If credentials are correct, create the JWT Payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // 4. Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the token back to the client
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;