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

    // Read the file from the file system
    fs.readFile(file.path, (err, data) => {
      if (err) throw err;

      // Set up S3 upload parameters
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.originalname, // File name you want to save as in S3
        Body: data,
        ContentType: file.mimetype,
        ACL: "public-read", // Optional: make the file publicly accessible
      };

      // Uploading files to the bucket
      s3.upload(params, async (err, data) => {
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

          res.send({
            ok: true,
            msg: "User Added Successfully!",
            resData,
            token,
          });
        }

        // Clean up file from the server after upload
        fs.unlinkSync(file.path);
      });
    });
  } catch (err) {
    console.log(err);
    res.send({ ok: false, msg: err?.message || "Something Went Wrong!" });
  }
};

/*
 {
        "name": "Yash Gupta",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocL8en6Hh33W7IRqWjzKd8uqa6-gf2TzBXxKg6QJT12WPb-AXw=s96-c",
        "iss": "https://securetoken.google.com/epic-test-4c318",
        "aud": "epic-test-4c318",
        "auth_time": 1722933135,
        "user_id": "svFU3kQL1JU2C4uyVHafriapd133",
        "sub": "svFU3kQL1JU2C4uyVHafriapd133",
        "iat": 1722933135,
        "exp": 1722936735,
        "email": "work200010@gmail.com",
        "email_verified": true,
        "firebase": {
            "identities": {
                "google.com": [
                    "102526335006057231276"
                ],
                "email": [
                    "work200010@gmail.com"
                ]
            },
            "sign_in_provider": "google.com"
        },
        "uid": "svFU3kQL1JU2C4uyVHafriapd133"
    }
*/
