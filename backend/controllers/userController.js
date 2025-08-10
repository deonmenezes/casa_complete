const User = require('../models/user');

// ✅ Create User
exports.createUser = async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error creating user:', err.message);
    console.error('Full error:', err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Users with Optional Filters
// ENHANCED: Added phone number filtering for user existence checks
exports.getUsers = async (req, res) => {
  try {
    const query = {};

    if (req.query.gender) query.gender = req.query.gender;
    if (req.query.age) query.age = Number(req.query.age);
    if (req.query.email) query.email = new RegExp(req.query.email, 'i'); // partial, case-insensitive
    if (req.query.phone) query.phone = req.query.phone; // ADDED: Exact phone number match for login checks
    if (req.query.interests) {
      const interestsArray = req.query.interests.split(',');
      query.interests = { $in: interestsArray };
    }

    const users = await User.find(query);
    console.log('User query:', query, 'Results:', users.length); // Debug logging
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Single User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update User by ID
// ENHANCED: Added logging for profile updates from manage account page
exports.updateUser = async (req, res) => {
  try {
    console.log('Updating user:', req.params.id, 'with data:', req.body);

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'User not found' });

    console.log('User updated successfully:', updated.display_name);
    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete User by ID
// ENHANCED: Added logging and better error handling for account deletion
exports.deleteUser = async (req, res) => {
  try {
    console.log('Attempting to delete user:', req.params.id);

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log('User not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User deleted successfully:', deleted.display_name, deleted.phone);
    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: deleted._id,
        name: deleted.display_name,
        phone: deleted.phone
      }
    });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// NEW: Delete User by Phone Number (for easier deletion from frontend)
exports.deleteUserByPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log('Attempting to delete user by phone:', phone);

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const deleted = await User.findOneAndDelete({ phone: phone });
    if (!deleted) {
      console.log('User not found for deletion with phone:', phone);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User deleted successfully by phone:', deleted.display_name, deleted.phone);
    res.json({
      message: 'Account deleted successfully',
      deletedUser: {
        id: deleted._id,
        name: deleted.display_name,
        phone: deleted.phone
      }
    });
  } catch (err) {
    console.error('Error deleting user by phone:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Generate OTP (demo only)
exports.generateOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    return res.json({ phone, otp }); // ⚠️ Don't expose OTP in prod
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
