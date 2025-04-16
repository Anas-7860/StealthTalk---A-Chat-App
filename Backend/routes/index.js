const express = require('express');
const router = express.Router();

// Import API routes
const authRoutes = require('./api/auth');
const roomRoutes = require('./api/room');
const chatRoutes = require('./api/chat');
const userRoutes = require('./api/user');

// Use routes
router.use('/api/auth', authRoutes);
router.use('/api/rooms', roomRoutes);
router.use('/api/chats', chatRoutes);
router.use('/api/users', userRoutes);

module.exports = router;