// uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to upload image" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: Date.now() + path.extname(req.file.originalname), // Unique filename with timestamp
      Body: req.file.buffer, // File data from memory
      ContentType: req.file.mimetype, // MIME type of the file
      ACL: "public-read", // Make the file publicly accessible (optional)
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file to S3:", err);
        return res.status(500).json({ error: "Failed to upload file to S3" });
      }

      console.log(data.Location);
      req.fileLocation = data.Location;

      req.body.profile_pic = data.Location;
      next();
    });
  });
};

module.exports = uploadToS3;
