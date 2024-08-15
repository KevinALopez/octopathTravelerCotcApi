const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");

router.post("/signup", async (req, res) => {
    await userController.postSignUp(req, res);
});

router.post("/login", userController.getUserByEmail, async (req, res) => {
    await userController.postLogin(req, res);
});

router.get("/logout", authMiddleware.isAuth, (req, res) => {
    userController.getLogout(req, res);
});

module.exports = { router };
