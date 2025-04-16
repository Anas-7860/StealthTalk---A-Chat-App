const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updateData = {
      username: req.body.username,
      email: req.body.email,
    };

    // If a new profile picture is uploaded
    if (req.file) {
      // Delete the old image if it's not the default
      if (user.profilePicture && user.profilePicture !== 'default-avatar.png') {
        const oldImagePath = path.join(__dirname, '../uploads', user.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.profilePicture = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/${updatedUser.profilePicture}`;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: fullImageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile picture if it's a custom one
    if (user.profilePicture && user.profilePicture !== 'default-avatar.png') {
      const filePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete profile picture:', err.message);
        } else {
          console.log('Profile picture deleted:', filePath);
        }
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Account and profile picture deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = {
  updateUser,
  deleteUser,
};
