const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user-controller");
const authenticateToken = require("./../middleware/authenticateToken");

const jwtAuth = require("./../middleware/jwtAuth");
const uploadToS3 = require("./../middleware/uploadTos3");
const multer = require("multer");

const uploadDir = "./uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// USER
router.get("/", jwtAuth, userController.getUsers);
router.get("/:id", jwtAuth, userController.getUsersByUserId);

router.post("/", userController.getUserById);

router.post(
  "/update",
  upload.single("image"),
  jwtAuth,
  userController.updateUser
);

router.post("/delete", jwtAuth, userController.deleteUser);

module.exports = router;
