const Room = require('../models/Room');
const Message = require('../models/Message');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
exports.createRoom = async (req, res) => {
  const { name, description, isPrivate } = req.body;

  try {
    // Check if room name exists
    const existingRoom = await Room.findOne({ name });
    
    if (existingRoom) {
      return res.status(400).json({ msg: 'Room name already exists' });
    }

    // Create new room
    const room = new Room({
      name,
      description,
      isPrivate,
      creator: req.user._id,
      members: [req.user._id]
    });

    await room.save();

    res.status(201).json(room);
  } catch (err) {
    console.error('Create room error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all public rooms
// @route   GET /api/rooms
// @access  Public
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('creator', 'username')
      .select('-members');
    
    res.json(rooms);
  } catch (err) {
    console.error('Get all rooms error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('creator', 'username')
      .populate('members', 'username');
    
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error('Get room by ID error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Join a room
// @route   POST /api/rooms/:id/join
// @access  Private
exports.joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if user is already a member
    if (room.members.includes(req.user._id)) {
      return res.status(400).json({ msg: 'Already a member of this room' });
    }

    // Add user to members array
    room.members.push(req.user._id);
    await room.save();

    res.json({ msg: 'Joined room successfully' });
  } catch (err) {
    console.error('Join room error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Leave a room
// @route   POST /api/rooms/:id/leave
// @access  Private
exports.leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if user is a member
    if (!room.members.includes(req.user._id)) {
      return res.status(400).json({ msg: 'Not a member of this room' });
    }

    // Remove user from members array
    room.members = room.members.filter(
      memberId => memberId.toString() !== req.user._id.toString()
    );
    
    await room.save();

    res.json({ msg: 'Left room successfully' });
  } catch (err) {
    console.error('Leave room error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};