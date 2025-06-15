require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e => console.error('❌ DB error:', e));

app.use('/auth', require('./routes/auth'));
app.use('/menu', require('./routes/menu'));
app.use('/orders', require('./routes/orders'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
