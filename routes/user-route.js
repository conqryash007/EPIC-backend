const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user-controller");
const authenticateToken = require("./../middleware/authenticateToken");

const jwtAuth = require("./../middleware/jwtAuth");
const uploadToS3 = require("./../middleware/uploadTos3");

// USER
router.get("/", jwtAuth, userController.getUsers);

router.post("/", userController.getUserById);

router.post("/update", jwtAuth, userController.updateUser);

router.post("/delete", jwtAuth, userController.deleteUser);

module.exports = router;
