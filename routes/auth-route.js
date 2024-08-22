const express = require("express");
const authController = require("./../controllers/auth-controller");
const router = express.Router();
const multer = require("multer");

const uploadDir = './uploads';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/signup', upload.single('image'),authController.signUp) 

module.exports = router;
