const Unit = require("../models/unit");

exports.getAllUnits = async (res) => {
    try {
        const units = await Unit.find({});
        res.json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUnitById = async (req, res, next) => {
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
};

exports.createNewUnit = async (req, res) => {
    const unit = new Unit(req.body);

    try {
        const newUnit = await unit.save();
        res.status(201).json(newUnit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUnit = async (req, res) => {
    for (const key in req.body) {
        res.unit[key] = req.body[key];
    }

    try {
        const updatedUnit = await res.unit.save();
        return res.status(200).json(updatedUnit);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteUnit = async (res) => {
    try {
        await Unit.deleteOne({ _id: res.unit._id });
        res.status(200).json({ message: "Unit deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
