const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      quantity: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
