const Message = require('../models/Message');
const Room = require('../models/Room');

// @desc    Get messages for a room
// @route   GET /api/chats/:roomId
// @access  Private
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'sender',
        select: 'username profilePicture'
      })
      .lean(); // convert to plain JS objects

    const total = await Message.countDocuments({ room: roomId });

    // Mask username for anonymous messages
    const maskedMessages = messages.map((msg) => {
      if (msg.isAnonymous) {
        return {
          ...msg,
          sender: {
            username: 'Anonymous',
            profilePicture: null, // optional: null if you want to hide profile pic too
          },
        };
      }
      return msg;
    });

    res.json({
      messages: maskedMessages.reverse(), // show oldest first
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get room messages error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Send message to a room
// @route   POST /api/chats/:roomId
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, isAnonymous } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if user is a member
    if (!room.members.includes(req.user._id)) {
      return res.status(403).json({ msg: 'Not a member of this room' });
    }

    const message = new Message({
      room: roomId,
      sender: req.user._id,
      content,
      isAnonymous: isAnonymous || false,
    });

    await message.save();

    await message.populate({
      path: 'sender',
      select: 'username profilePicture',
    });

    // Return masked message if anonymous
    const responseMessage = message.isAnonymous
      ? {
          ...message.toObject(),
          sender: {
            username: 'Anonymous',
            profilePicture: null,
          },
        }
      : message;

    res.status(201).json(responseMessage);
  } catch (err) {
    console.error('Send message error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
// @desc    Delete a message
// @route   DELETE /api/chats/message/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    // Only allow deletion by the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized to delete this message" });
    }

    await message.deleteOne();

    res.status(200).json({ msg: "Message deleted successfully", messageId });
  } catch (err) {
    console.error("Delete message error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
