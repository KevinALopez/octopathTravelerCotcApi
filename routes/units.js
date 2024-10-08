const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");
const authMiddleware = require("../middlewares/auth");

//Getting all
router.get("/", async (req, res) => {
    await unitController.getAllUnits(res);
});

//Getting One
router.get("/:id", unitController.getUnitById, (req, res) => {
    res.send(res.unit);
});

//Creating One
router.post("/", authMiddleware.isAuth, async (req, res) => {
    await unitController.createNewUnit(req, res);
});

//Updating One
router.patch(
    "/:id",
    authMiddleware.isAuth,
    unitController.getUnitById,
    async (req, res) => {
        await unitController.updateUnit(req, res);
    }
);

//Deleting One
router.delete(
    "/:id",
    authMiddleware.isAuth,
    unitController.getUnitById,
    async (req, res) => {
        await unitController.deleteUnit(res);
    }
);

module.exports = { router };
