require("dotenv").config();
const mongoConnect = require("./utils/mongoDatabase");
const express = require("express");
const app = express();
const port = process.env.PORT;

app.use(express.json());

const unitsRouter = require("./routes/units");
app.use("/units", unitsRouter);

mongoConnect.intializeDbConnection(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
