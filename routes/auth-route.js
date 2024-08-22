const express = require("express");
const authController = require("./../controllers/auth-controller");
const router = express.Router();
const multer = require("multer");

const uploadToS3 = require("./../middleware/uploadTos3");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log(file, "file");

    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });

// router.post("/signup", upload.single("image"), authController.signUp);
router.post("/signup", upload.single("image"), function (req, res, next) {
  console.log("path", JSON.stringify(req.file.path));
  console.log("path", JSON.stringify(req.file));
  var response = '<a href="/">Home</a><br>';
  response += "Files uploaded successfully.<br>";
  response += `<img src="${req.file.path}" /><br>`;
  return res.send(response);
});

module.exports = router;
