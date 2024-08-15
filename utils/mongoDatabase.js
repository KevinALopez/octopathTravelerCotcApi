require("dotenv").config();
const mongoose = require("mongoose");

let _db;

const intializeDbConnection = (callback) => {
    mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.DBNAME });
    _db = mongoose.connection;
    _db.on("error", (error) => {
        console.error(error);
    });
    _db.once("open", () => {
        console.log("Connected to database.");
        callback();
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    } else {
        throw "No connection found!";
    }
};

exports.getDb = getDb;
exports.intializeDbConnection = intializeDbConnection;
