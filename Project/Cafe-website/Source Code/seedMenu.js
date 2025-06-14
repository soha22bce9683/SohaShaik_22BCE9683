// seedMenu.js
const mongoose = require('mongoose');
const MenuItem = require('./models/menuItem');
require('dotenv').config();

const items = [
  { name: 'Cappuccino', price: 150 },
  { name: 'Espresso', price: 120 },
  { name: 'Latte', price: 160 },
  { name: 'Mocha', price: 180 },
  { name: 'Cold Coffee', price: 130 }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await MenuItem.deleteMany(); // optional: clears old items
    await MenuItem.insertMany(items);
    console.log('Menu seeded');
    mongoose.disconnect();
  })
  .catch(err => console.error('MongoDB error:', err));
