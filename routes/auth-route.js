const express = require("express");
const authController = require("./../controllers/auth-controller");
const router = express.Router();
const multer = require("multer");

const fs = require("fs");

const uploadToS3 = require("./../middleware/uploadTos3");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", upload.single("image"), authController.signUp);
// router.post("/signup", upload.single("image"), function (req, res, next) {
//   const { image } = req.body;

//   if (!image) {
//     return res.status(400).send("No image provided");
//   }

//   const matches = image.match(/^data:(.+);base64,(.+)$/);
//   if (!matches) {
//     return res.status(400).send("Invalid image format");
//   }

//   const mimeType = matches[1];
//   const base64Data = matches[2];
//   const extension = mimeType.split("/")[1]; // Extract file extension (e.g., png, jpg)

//   const fileName = `uploaded_image.${extension}`;

//   fs.writeFile(fileName, base64Data, "base64", (err) => {
//     if (err) {
//       console.error("Error saving image:", err);
//       return res.status(500).send("Failed to save image");
//     }
//     res.send(`Image uploaded successfully as ${fileName}`);
//   });
// });

module.exports = router;
