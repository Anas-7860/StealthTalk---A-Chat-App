const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/chatController');
const auth = require('../../middleware/auth');

// @route   GET /api/chats/:roomId
// @desc    Get messages for a room
// @access  Private
router.get('/:roomId', auth, chatController.getRoomMessages);

// @route   POST /api/chats/:roomId
// @desc    Send a message to a room
// @access  Private
router.post('/:roomId', auth, chatController.sendMessage);

// ✅ NEW: Delete a specific message
// @route   DELETE /api/chats/message/:id
// @desc    Delete a message by ID
// @access  Private
router.delete('/message/:id', auth, chatController.deleteMessage);

module.exports = router;
