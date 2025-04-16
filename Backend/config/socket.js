const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Only store necessary user info
      socket.user = {
        _id: user._id,
        username: user.username
      };

      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username}`);

    // Join a room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`➡️ ${socket.user.username} joined room: ${roomId}`);

      // Notify others in the room
      socket.to(roomId).emit('user_joined', {
        userId: socket.user._id,
        username: 'Anonymous', // Assume anonymous unless revealed elsewhere
        isAnonymous: true // Always anonymous for other users
      });
    });

    // Leave a room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`⬅️ ${socket.user.username} left room: ${roomId}`);

      socket.to(roomId).emit('user_left', {
        userId: socket.user._id,
        username: 'Anonymous',
        isAnonymous: true
      });
    });

    // Send message
    socket.on('send_message', async (messageData) => {
      try {
        const { roomId, content, isAnonymous } = messageData;

        // Create and save message
        const message = new Message({
          room: roomId,
          sender: socket.user._id,
          content,
          isAnonymous
        });

        await message.save();

        // Broadcast to room
        io.to(roomId).emit('new_message', {
          _id: message._id,
          room: roomId,
          sender: {
            _id: socket.user._id,
            username: isAnonymous ? 'Anonymous' : socket.user.username,
            isAnonymous
          },
          content,
          createdAt: message.createdAt
        });
      } catch (error) {
        console.error('❌ Socket message error:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Typing indicator
    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('user_typing', {
        userId: socket.user._id,
        username: 'Anonymous',
        isAnonymous: true
      });
    });

    socket.on('stop_typing', (roomId) => {
      socket.to(roomId).emit('user_stop_typing', {
        userId: socket.user._id
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❎ User disconnected: ${socket.user.username}`);
    });
  });
};
