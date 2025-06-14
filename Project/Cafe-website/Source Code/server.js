const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const User = require('./models/user');
const MenuItem = require('./models/menu');
const Order = require('./models/order');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cafeApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  preloadMenuItems(); // Preload menu on first run
}).catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);

// Get menu items
app.get('/menu', async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

// Place order
app.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
});

// Preload sample menu
async function preloadMenuItems() {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany([
      { name: 'Coffee', price: 80 },
      { name: 'Latte', price: 100 },
      { name: 'Cappuccino', price: 110 },
      { name: 'Croissant', price: 70 },
      { name: 'Muffin', price: 60 }
    ]);
    console.log('☕ Preloaded menu items.');
  }
}

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
