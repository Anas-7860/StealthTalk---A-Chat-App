const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/roomController');
const auth = require('../../middleware/auth');

// @route   GET /api/rooms
// @desc    Get all public rooms
// @access  Public
router.get('/', roomController.getAllRooms);

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', auth, roomController.createRoom);

// @route   GET /api/rooms/:id
// @desc    Get a room by ID
// @access  Private
router.get('/:id', auth, roomController.getRoomById);

// @route   POST /api/rooms/:id/join
// @desc    Join a room
// @access  Private
router.post('/:id/join', auth, roomController.joinRoom);

// @route   POST /api/rooms/:id/leave
// @desc    Leave a room
// @access  Private
router.post('/:id/leave', auth, roomController.leaveRoom);

module.exports = router;