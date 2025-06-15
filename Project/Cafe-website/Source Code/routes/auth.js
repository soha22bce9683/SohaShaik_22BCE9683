const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await new User({ username, email, password: hashed }).save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Signup error', error: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login successful', token });
  } catch (e) {
    res.status(500).json({ message: 'Login error', error: e.message });
  }
});

module.exports = router;
