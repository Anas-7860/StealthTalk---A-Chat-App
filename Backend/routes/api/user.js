const express = require('express');
const router = express.Router();
const {
  updateUser,
  deleteUser,
} = require('../../controllers/userController');
const authMiddleware = require('../../middleware/auth');
const upload = require('../../middleware/upload'); // <== multer middleware

// Update user profile (with optional profile picture)
router.put('/edit', authMiddleware, upload.single("profilePicture"), updateUser);

// Delete user account
router.delete('/delete', authMiddleware, deleteUser);

module.exports = router;
