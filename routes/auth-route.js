const express = require("express");
const authController = require("./../controllers/auth-controller");
const router = express.Router();
const multer = require("multer");

const uploadToS3 = require("./../middleware/uploadTos3");

const upload = multer({ dest: "uploads/" });

router.post("/signup", upload.single("image"), authController.signUp);

module.exports = router;
