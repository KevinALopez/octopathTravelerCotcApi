const unitController = require("../../controllers/unitController");
const Unit = require("../../models/unit");
const httpMocks = require("node-mocks-http");
const unitData = require("../mock-data/mock-unit.json");
const allUnitsData = require("../mock-data/mock-all-units.json");

jest.mock("../../models/unit");

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("unitController.getUnitById", () => {
    it("should be a function", () => {
        expect(typeof unitController.getUnitById).toBe("function");
    });
    it("should call the method Unit.findById", async () => {
        req.params.id = "66b38a35f1a948bf5f918042";
        Unit.findById.mockReturnValue(unitData);
        await unitController.getUnitById(req, res, next);
        expect(Unit.findById).toBeCalledWith(req.params.id);
        expect(res.unit).toBe(unitData);
        expect(next).toBeCalled();
    });
    it("should send response 404 and message when not finding unit", async () => {
        Unit.findById.mockReturnValue(null);
        await unitController.getUnitById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({ message: "Cannot find unit." });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        const rejectedPromise = Promise.reject({ message: "Error" });
        Unit.findById.mockReturnValue(rejectedPromise);
        await unitController.getUnitById(req, res, next);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("unitController.getAllUnits", () => {
    it("should be a function", () => {
        expect(typeof unitController.getAllUnits).toBe("function");
    });
    it("should call the method Unit.find and respond with all units", async () => {
        Unit.find.mockReturnValue(allUnitsData);
        await unitController.getAllUnits(res);
        expect(Unit.find).toBeCalledWith({});
        expect(res._getJSONData()).toEqual(allUnitsData);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle error and send error message", async () => {
        const rejectedPromise = Promise.reject({ message: "Error" });
        Unit.find.mockReturnValue(rejectedPromise);
        await unitController.getAllUnits(res);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("unitController.createNewUnit", () => {
    it("should be a function", () => {
        expect(typeof unitController.getUnitById).toBe("function");
    });
    it("should create a new unit and send it as response", async () => {
        req.body = unitData;
        const saveSpy = jest.spyOn(Unit.prototype, "save");
        saveSpy.mockImplementation(() => unitData);
        await unitController.createNewUnit(req, res);
        expect(Unit).toBeCalledWith(req.body);
        expect(saveSpy).toBeCalled();
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual(unitData);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle error on save execution and send error message", async () => {
        req.body = unitData;
        const rejectedPromise = Promise.reject({ message: "Error" });
        const saveSpy = jest.spyOn(Unit.prototype, "save");
        saveSpy.mockImplementation(() => rejectedPromise);
        await unitController.createNewUnit(req, res);
        expect(Unit).toBeCalledWith(req.body);
        expect(saveSpy).toBeCalled();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("unitController.updateUnit", () => {
    it("should be a function", () => {
        expect(typeof unitController.getUnitById).toBe("function");
    });
    it("should update unit and send updated unit back", async () => {
        req.body = { name: "test", class: "scholar" };
        res.unit = new Unit(unitData);
        const updatedUnit = [{ ...unitData, name: "test", class: "scholar" }];
        const saveSpy = jest.spyOn(Unit.prototype, "save");
        saveSpy.mockImplementation(() => updatedUnit);
        await unitController.updateUnit(req, res);
        expect(saveSpy).toBeCalled();
        expect(res._getJSONData()).toEqual(updatedUnit);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors and send a message back", async () => {
        req.body = { name: "test", class: "scholar" };
        res.unit = new Unit(unitData);
        const rejectedPromise = Promise.reject({ message: "Error" });
        const saveSpy = jest.spyOn(Unit.prototype, "save");
        saveSpy.mockImplementation(() => rejectedPromise);
        await unitController.updateUnit(req, res);
        expect(saveSpy).toBeCalled();
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res.statusCode).toBe(500);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("unitController.deleteOne", () => {
    it("should be a function", () => {
        expect(typeof unitController.getUnitById).toBe("function");
    });
    it("should delete a unit and send a succesful response back", async () => {
        res.unit = new Unit(unitData);
        await unitController.deleteUnit(res);
        expect(Unit.deleteOne).toBeCalledWith({ _id: res.unit._id });
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Unit deleted." });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors and send message back", async () => {
        res.unit = new Unit(unitData);
        const rejectedPromise = Promise.reject({ message: "Error" });
        Unit.deleteOne.mockReturnValue(rejectedPromise);
        await unitController.deleteUnit(res);
        expect(Unit.deleteOne).toBeCalledWith({ _id: res.unit._id });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});
