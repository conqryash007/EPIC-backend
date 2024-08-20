const express = require("express");
const router = express.Router();

const usersChildController = require("../controllers/child-controller");
const jwtAuth = require("./../middleware/jwtAuth");

router.get("/", jwtAuth, usersChildController.getChildrenByUserId);
router.get("/:id", jwtAuth, usersChildController.getChildById);

router.post("/create", jwtAuth, usersChildController.createChildren);

router.post("/update/:id", jwtAuth, usersChildController.updateChild);
router.post("/delete/:id", jwtAuth, usersChildController.deleteChild);

module.exports = router;
