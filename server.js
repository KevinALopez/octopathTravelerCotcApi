require("dotenv").config();
const mongoConnect = require("./utils/mongoDatabase");
const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const port = process.env.PORT;

var corsOptions = {
    origin: ["http://cotcteamhelper.com", "http://localhost:5173"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
    session({
        name: "session",
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 12 },
    })
);

const s3Bucket = require("./routes/s3.js");
app.use("/s3", s3Bucket.router);

const units = require("./routes/units");
app.use("/units", units.router);

const users = require("./routes/users");
app.use("/users", users.router);

mongoConnect.intializeDbConnection(() => {});

const appServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = { app, appServer };
