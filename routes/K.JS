const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");

const app = express();

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your secret access key
  region: process.env.AWS_REGION, // Replace with your region
});

const s3 = new AWS.S3();

// Configure multer for file handling
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;

  // Read the file from the file system
  fs.readFile(file.path, (err, data) => {
    if (err) throw err;

    // Set up S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME, // Replace with your bucket name
      Key: file.originalname, // File name you want to save as in S3
      Body: data,
      ContentType: file.mimetype,
      ACL: "public-read", // Optional: make the file publicly accessible
    };

    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
      if (err) {
        res.status(500).send("Error uploading file");
      } else {
        res.status(200).send(`File uploaded successfully. ${data.Location}`);
      }

      // Clean up file from the server after upload
      fs.unlinkSync(file.path);
    });
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
