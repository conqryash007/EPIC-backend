const User = require("./../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

function generateToken(id) {
  const payload = {
    id: id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
}

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
    const { mobile, email, verify, uid } = req.body;

    if (mobile) {
      const mobUser = await User.find({ mobile });

      if (mobUser.length > 0) {
        if (verify) {
          const token = generateToken(mobUser[0]._id);
          return res
            .status(200)
            .json({ ok: true, data: mobUser[0], msg: "User exists", token });
        } else {
          return res
            .status(200)
            .json({ ok: true, data: mobUser[0], msg: "User exists" });
        }
      }
    }

    if (email) {
      const mailUser = await User.find({ email });

      if (mailUser.length > 0) {
        if (verify) {
          const token = generateToken(mailUser[0]._id);
          return res
            .status(200)
            .json({ ok: true, data: mailUser[0], msg: "User exists", token });
        } else {
          return res
            .status(200)
            .json({ ok: true, data: mailUser[0], msg: "User exists" });
        }
      }
    }

    return res
      .status(200)
      .json({ ok: true, data: {}, msg: "User does not exists" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Update a user
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(userId, req.body, {
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
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ ok: true, msg: "User deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
