const express = require("express");
const router = express.Router();
const Unit = require("../models/unit");

//Getting all
router.get("/", async (req, res) => {
    try {
        const units = await Unit.find({});
        res.send(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Getting One
router.get("/:id", getUnitById, (req, res) => {
    res.send(res.unit);
});

//Creating One
router.post("/", async (req, res) => {
    const unit = new Unit(req.body);

    try {
        const newUnit = await unit.save();
        res.status(201).json(newUnit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Updating One
router.patch("/:id", getUnitById, async (req, res) => {
    for (const key in req.body) {
        res.unit[key] = req.body[key];
    }

    try {
        const updatedUnit = await res.unit.save();
        return res.status(200).json(updatedUnit);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//Deleting One
router.delete("/:id", getUnitById, async (req, res) => {
    try {
        await Unit.deleteOne({ _id: res.unit._id });
        res.json({ message: "Unit deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function getUnitById(req, res, next) {
    let unit;
    try {
        unit = await Unit.findById(req.params.id);
        if (unit == null) {
            return res.status(404).json({ message: "Cannot find unit." });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.unit = unit;
    next();
}

module.exports = router;
