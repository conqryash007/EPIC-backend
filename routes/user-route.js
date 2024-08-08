const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user-controller");
const authenticateToken = require("./../middleware/authenticateToken");

// USER
router.get("/", authenticateToken, userController.getUsers);
router.get("/:userId", authenticateToken, userController.getUserById);

router.post("/update", authenticateToken, userController.updateUser);

router.post("/delete", authenticateToken, userController.deleteUser);

module.exports = router;
