const express = require("express");
const router = express.Router();
const s3Controller = require("../controllers/s3Controller");
const authMiddleware = require("../middlewares/auth");

router.get(
    "/presignedUrl/:folder/:name",
    authMiddleware.isAuth,
    async (req, res) => {
        await s3Controller.getPresignedUrl(req, res);
    }
);

module.exports = { router };
