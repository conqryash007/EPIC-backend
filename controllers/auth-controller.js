const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const AWS = require("aws-sdk");

require("dotenv").config();

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

function generateToken(id) {
  const payload = {
    id: id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

module.exports.signUp = async (req, res) => {
  try {
    const { mobile, email } = req.body;
    const isPresent = await doesUserExists(mobile, email);
    if (isPresent) {
      return res.send({ ok: false, msg: "User Already Exits" });
    }
    const file = req.file;
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

          const userToSave = new User({
            ...req.body,
            profile_pic: data.Location,
          });
          const resData = await userToSave.save();

          const token = generateToken(resData._id);
          console.log("upload data", token, resData);

          res.send({
            ok: true,
            msg: "User Added Successfully!",
            resData,
            token,
          });
        }
        fs.unlinkSync(file.path);
      });
    });
  } catch (err) {
    console.log(err);
    res.send({ ok: false, msg: err?.message || "Something Went Wrong!" });
  }
};
