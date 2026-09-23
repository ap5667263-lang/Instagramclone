const express = require('express');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);

module.exports = app;
