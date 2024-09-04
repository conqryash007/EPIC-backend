const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const fs = require("fs");

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

module.exports.getUsersByUserId = async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    res.status(200).json({ ok: true, data: users });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

const doesUserExists = async (mobile, email) => {
  if (mobile) {
    const mobUser = await User.find({ mobile });

    if (mobUser.length > 0) {
      return true;
    }
  }

  if (email) {
    const mailUser = await User.find({ email });

    if (mailUser.length > 0) {
      return true;
    }
  }

  return false;
};
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Update a user
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { mobile, email } = req.body;
    const isPresent = await doesUserExists(mobile, email);
    if (isPresent) {
      return res.send({ ok: false, msg: "User Already Exits" });
    }

    const file = req.file;
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) throw err;
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: file.originalname,
          Body: data,
          ContentType: file.mimetype,
          ACL: "public-read",
        };
        s3.upload(params, async (err, data) => {
          console.log("upload data", data, params);

          if (err) {
            console.log("Error uploading file", err);
            throw new Error("Error uploading file");
          } else {
            const userRes = await User.findByIdAndUpdate(userId, {
              ...req.body,
              profile_pic: data.Location,
            });

            res.send({
              ok: true,
              msg: "User Updated Successfully!",
              userRes,
            });
            fs.unlinkSync(file.path);
            return;
          }
        });
      });
    } else {
      const userRes = await User.findByIdAndUpdate(userId, {
        ...req.body,
      });

      return res.send({
        ok: true,
        msg: "User Updated Successfully!",
        userRes,
      });
    }
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
      return res.status(200).json({ message: "User not found" });
    }
    res.status(200).json({ ok: true, msg: "User deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
