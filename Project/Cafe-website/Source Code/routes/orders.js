const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    next();
  } catch (e) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

router.post('/', auth, async (req, res) => {
  const { items, total } = req.body;
  try {
    await new Order({ userId: req.userId, items, total }).save();
    res.json({ message: 'Order placed successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Order error', error: e.message });
  }
});

module.exports = router;
