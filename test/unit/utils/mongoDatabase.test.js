require("dotenv").config();
const mongoDatabase = require("../../../utils/mongoDatabase");
const mongoose = require("mongoose");

describe("mongoDatabase.getDb", () => {
    it("should throw an error when no connection found", () => {
        expect(() => {
            mongoDatabase.getDb();
        }).toThrow("No connection found!");
    });
    it("should an existing db connection", () => {
        // Arrange
        const connectSpy = jest.spyOn(mongoose, "connect");
        connectSpy.mockImplementation(() => "connected");
        mongoose.connection.on = jest.fn();
        mongoose.connection.once = jest.fn();
        process.env.DATABASE_URL = "mongoUri";
        process.env.DBNAME = "dev";
        const callback = jest.fn();
        mongoDatabase.intializeDbConnection(callback);
        mongoose.connection = true;

        // Act
        const value = mongoDatabase.getDb();

        //Assert
        expect(value).toBeTruthy();
    });
});

describe("mongoDatabase.intializeDbConnection", () => {
    it("should call mongoose.connection", () => {
        // Arrange
        const connectSpy = jest.spyOn(mongoose, "connect");
        connectSpy.mockImplementation(() => "connected");
        const consoleErrorSpy = jest.spyOn(console, "error");
        const consoleLogSpy = jest.spyOn(console, "log");
        mongoose.connection.on = jest.fn();
        mongoose.connection.once = jest.fn();
        process.env.DATABASE_URL = "mongoUri";
        process.env.DBNAME = "dev";
        const callback = jest.fn();

        // Act
        mongoDatabase.intializeDbConnection(callback);

        // Assert
        const errorCallback = mongoose.connection.on.mock.calls[0][1];
        const succesCallback = mongoose.connection.once.mock.calls[0][1];
        errorCallback("boom!");
        succesCallback();

        expect(connectSpy).toBeCalledWith("mongoUri", { dbName: "dev" });
        expect(mongoose.connection.on).toBeCalledWith("error", errorCallback);
        expect(consoleErrorSpy).toBeCalledWith("boom!");
        expect(mongoose.connection.once).toBeCalledWith("open", succesCallback);
        expect(consoleLogSpy).toBeCalledWith("Connected to database.");
        expect(callback).toBeCalled();
    });
});
