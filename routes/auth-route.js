const express = require("express");
const authController = require("./../controllers/auth-controller");
const router = express.Router();
const multer = require("multer");

const uploadToS3 = require("./../middleware/uploadTos3");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");

    console.log("cb desti", file);
  },
  filename: function (req, file, cb) {
    console.log(file, "file");

    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });

router.post("/signup", upload.single("image"), authController.signUp);

module.exports = router;
