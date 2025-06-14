const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  itemName: String,
  price: Number
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
