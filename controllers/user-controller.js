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
    const { params } = req.body; // Extract 'params' from the body
    const { mobile, email, verify } = params; // Extract 'mobile', 'email', and 'verify' from 'params'

    // Helper function to handle user responses
    const handleUserResponse = (user, msg) => {
      if (user.length > 0) {
        const response = { ok: true, data: user[0], msg };
        if (!verify) {
          response.token = generateToken(user[0]._id);
        }
        return res.status(200).json(response);
      }
    };

    if (mobile) {
      const mobUser = await User.find({ mobile });

      if (mobUser?.length) {
        handleUserResponse(mobUser, "Login Successfully..!");
      } else {
        return res
          .status(200)
          .json({ ok: false, data: {}, msg: "User does not exist" });
      }
    }

    if (email) {
      const mailUser = await User.find({ email });

      if (mailUser.length) {
        handleUserResponse(mailUser, "Login Successfully..!");
      } else {
        return res
          .status(200)
          .json({ ok: false, data: {}, msg: "User does not exist" });
      }
    }
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
  // try {
  //   const { mobile, email, verify, uid } = req.body;
  //   console.log("body", req.body);

  //   if (mobile) {
  //     const mobUser = await User.find({ mobile });
  //     console.log("body", mobUser, mobUser[0]._id);

  //     if (mobUser.length > 0) {
  //       if (verify) {
  //         const token = generateToken(mobUser[0]._id);
  //         return res
  //           .status(200)
  //           .json({ ok: true, data: mobUser[0], msg: "User exists", token });
  //       } else {
  //         return res
  //           .status(200)
  //           .json({ ok: true, data: mobUser[0], msg: "User exists" });
  //       }
  //     }
  //   }

  //   if (email) {
  //     const mailUser = await User.find({ email });

  //     if (mailUser.length > 0) {
  //       if (verify) {
  //         const token = generateToken(mailUser[0]._id);
  //         return res
  //           .status(200)
  //           .json({ ok: true, data: mailUser[0], msg: "User exists", token });
  //       } else {
  //         return res
  //           .status(200)
  //           .json({ ok: true, data: mailUser[0], msg: "User exists" });
  //       }
  //     }
  //   }

  //   return res
  //     .status(200)
  //     .json({ ok: true, data: {}, msg: "User does not exists" });
  // } catch (error) {
  //   res.status(500).json({ ok: false, msg: error.message });
  // }
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
