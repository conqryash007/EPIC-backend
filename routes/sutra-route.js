const express = require("express");
const router = express.Router();
const jwtAuth = require("./../middleware/jwtAuth");

const sutraController = require("./../controllers/sutraController");

router.get("/", jwtAuth);

module.exports = router;
