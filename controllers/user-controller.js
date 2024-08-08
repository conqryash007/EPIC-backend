const User = require("./../models/User");

// Get all users
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ ok: true, data: users });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Get a user by ID
module.exports.getUserById = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.find({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ ok: true, data: user });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Update a user
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findOneAndUpdate({ userId }, req.body, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ ok: true, data: user });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

// Delete a user
module.exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ ok: true, msg: "User deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
