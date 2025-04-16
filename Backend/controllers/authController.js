const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      authProvider: 'local'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        authProvider: user.authProvider,
        isAnonymous: user.isAnonymous,
        profilePicture: user.profilePicture // ✅ add this
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error or small password' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        authProvider: user.authProvider,
        isAnonymous: user.isAnonymous,
        profilePicture: user.profilePicture // ✅ add this
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create a guest user
// @route   POST /api/auth/guest
// @access  Public
exports.createGuestUser = async (req, res) => {
  try {
    const guestUsername = `guest_${Math.random().toString(36).substring(2, 10)}`;
    
    // Create new guest user
    const user = new User({
      username: guestUsername,
      authProvider: 'guest',
      isAnonymous: true
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        authProvider: user.authProvider,
        isAnonymous: user.isAnonymous,
      }
    });
  } catch (err) {
    console.error('Guest creation error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      authProvider: user.authProvider,
      isAnonymous: user.isAnonymous,
      profilePicture: user.profilePicture, // ✅ add this
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Get current user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};