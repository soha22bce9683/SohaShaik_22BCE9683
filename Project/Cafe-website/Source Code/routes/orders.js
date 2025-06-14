const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const router = express.Router();

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId: ... }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

// Place an order
router.post('/place', verifyToken, async (req, res) => {
  const { items } = req.body; // [{ itemId, quantity }]
  try {
    const order = new Order({
      userId: req.user.userId,
      items
    });
    await order.save();
    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
});

// View user's orders
router.get('/my', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate('items.itemId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

module.exports = router;
