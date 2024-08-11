const mongoose = require("mongoose");

const statByLevelSchema = mongoose.Schema({
    _id: false,
    level: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    hp: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    sp: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    physicalAttack: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    physicalDefense: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    magicAttack: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    magicDefense: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    crit: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    speed: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
});

const resistanceSchema = mongoose.Schema({
    _id: false,
    element: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
});

const statAffectedSchema = mongoose.Schema({
    _id: false,
    stat: {
        type: String,
        required: true,
    },
    potency: {
        type: Number,
        required: true,
    },
});

const potencyByUltLevelSchema = mongoose.Schema({
    _id: false,
    level1: {
        type: Number,
        required: true,
    },
    level10: {
        type: Number,
        required: true,
    },
});

const statAffectedByUltLevelSchema = mongoose.Schema({
    _id: false,
    stat: {
        type: String,
        require: true,
    },
    potency: {
        type: potencyByUltLevelSchema,
        required: true,
    },
});

const skillInfoSchema = mongoose.Schema({
    _id: false,
    type: {
        type: [String],
        default: undefined,
        required: true,
    },
    stacking: {
        type: String,
    },
    statsBuffed: {
        type: [statAffectedSchema],
        default: undefined,
    },
    statsDebuffed: {
        type: [statAffectedSchema],
        default: undefined,
    },
    effects: {
        type: [String],
        default: undefined,
    },
});

const skillSchema = mongoose.Schema({
    _id: false,
    unlockAt: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    has6StarUpgrade: {
        type: Boolean,
    },
    upgrade: {
        type: String,
    },
    conditionToUse: {
        type: String,
    },
    numberOfUses: {
        type: Number,
    },
    spCost: {
        type: Number,
    },
    level88SpCost: {
        type: Number,
    },
    level96SpCost: {
        type: Number,
    },
    level99SpCost: {
        type: Number,
    },
    level100SpCost: {
        type: Number,
    },
    weaknessExploited: {
        type: [String],
        default: undefined,
    },
    skillInfo: {
        type: skillInfoSchema,
        required: true,
    },
    tags: {
        type: [String],
        default: undefined,
        required: true,
    },
});

const specialDescriptionSchema = mongoose.Schema({
    _id: false,
    level1: {
        type: String,
        required: true,
    },
    level10: {
        type: String,
        required: true,
    },
});

const specialSchema = mongoose.Schema({
    _id: false,
    description: {
        type: specialDescriptionSchema,
        required: true,
    },
    weaknessExploited: {
        type: [String],
        default: undefined,
    },
    type: {
        type: [String],
        default: undefined,
        required: true,
    },
    stacking: {
        type: String,
    },
    statsBuffed: {
        type: [statAffectedByUltLevelSchema],
        default: undefined,
    },
    statsDebuffed: {
        type: [statAffectedByUltLevelSchema],
        default: undefined,
    },
    tags: {
        type: [String],
        required: true,
    },
});

const passiveInfoSchema = mongoose.Schema({
    _id: false,
    type: {
        type: [String],
        default: undefined,
        required: true,
    },
    stacking: {
        type: String,
    },
    statsBuffed: {
        type: [statAffectedSchema],
        default: undefined,
    },
    statsDebuffed: {
        type: [statAffectedSchema],
        default: undefined,
    },
    effects: {
        type: [String],
        default: undefined,
    },
});

const passiveSchema = mongoose.Schema({
    _id: false,
    unlockAt: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    has6StarUpgrade: {
        type: Boolean,
    },
    upgrade: {
        type: String,
    },
    passiveInfo: {
        type: passiveInfoSchema,
        required: true,
    },
    tags: {
        type: [String],
        default: undefined,
        required: true,
    },
});

const teamCapabilitiesSchema = mongoose.Schema({
    _id: false,
    buff: {
        type: [String],
        default: undefined,
    },
    debuff: {
        type: [String],
        default: undefined,
    },
});

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    influence: {
        type: String,
        required: true,
    },
    baseClass: {
        type: String,
        required: true,
    },
    hasTp: {
        type: Boolean,
        required: true,
    },
    hasSixStar: {
        type: Boolean,
        required: true,
    },
    stats: {
        type: [statByLevelSchema],
        default: undefined,
        required: true,
    },
    resistances: {
        type: [resistanceSchema],
        default: undefined,
        required: true,
    },
    skills: {
        type: [skillSchema],
        default: undefined,
        required: true,
    },
    special: {
        type: specialSchema,
        required: true,
    },
    passives: {
        type: [passiveSchema],
        default: undefined,
        required: true,
    },
    teamCapabilities: {
        type: teamCapabilitiesSchema,
    },
});

module.exports = mongoose.model("unit", unitSchema);
