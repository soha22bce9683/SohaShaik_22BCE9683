const express = require('express');
const MenuItem = require('../models/menuItem');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching menu', error: e.message });
  }
});

module.exports = router;
