const express = require("express");
const authController = require("./../controllers/auth-controller");
const router = express.Router();

const uploadToS3 = require("./../middleware/uploadTos3");

router.post("/signup", uploadToS3, authController.signUp);

module.exports = router;
