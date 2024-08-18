const express = require("express");
const router = express.Router();

const usersChildController = require("../controllers/child-controller");
const authenticateToken = require("./../middleware/authenticateToken");

router.get("/", authenticateToken, usersChildController.getChildrenByUserId);
router.get("/:id", authenticateToken, usersChildController.getChildById);

router.post("/create", authenticateToken, usersChildController.createChildren);

router.post("/update/:id", authenticateToken, usersChildController.updateChild);
router.post("/delete/:id", authenticateToken, usersChildController.deleteChild);

module.exports = router;
