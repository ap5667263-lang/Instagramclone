const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
const musicRoutes = require('./routes/musicRoutes');
const followRoutes = require('./routes/followRoutes');
const storyRoutes = require('./routes/stroyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reelsRoutes = require('./routes/reelsRoutes');
const searchRoutes = require('./routes/searchRoutes');
const feedRoutes = require('./routes/feedRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('hello world'));

app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/users', followRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reels', reelsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/feed', feedRoutes);

module.exports = app;
