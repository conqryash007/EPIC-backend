const express = require("express");
const authenticateToken = require("./../middleware/authenticateToken");
const authController = require("./../controllers/auth-controller");
const router = express.Router();

router.post("/signup", authController.signUp);

module.exports = router;
