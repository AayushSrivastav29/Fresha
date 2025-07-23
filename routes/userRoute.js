const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/find", userController.findUser);
router.post("/create", userController.createUser);
router.post("/update", auth, userController.updateUser);
router.post("/forgotpassword", userController.forgotPassword);
router.get("/resetpassword/:id", userController.resetPassword);
router.patch("/updatepassword", userController.updatePassword);

module.exports = router;
