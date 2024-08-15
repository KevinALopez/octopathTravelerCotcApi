const authController = require("../../../controllers/authController");
const User = require("../../../models/user");
const bcrypt = require("bcryptjs");
const httpMocks = require("node-mocks-http");
const mockUser = require("../../mock-data/mock-user.json");

jest.mock("../../../models/user");
[bcrypt.hash, bcrypt.compare] = [jest.fn(), jest.fn()];
User.findOne = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("authController.postSignUp", () => {
    it("should be a function", () => {
        expect(typeof authController.postSignUp).toBe("function");
    });
    it("should add new user and send confimation response", async () => {
        //Arrange
        req.body = mockUser;
        bcrypt.hash.mockImplementation(() => "encryptedPassword");
        const newUser = { ...mockUser, password: "encryptedPassword" };
        const saveSpy = jest.spyOn(User.prototype, "save");
        saveSpy.mockImplementation(() => newUser);

        //Act
        await authController.postSignUp(req, res, next);

        //Assert
        expect(bcrypt.hash).toBeCalledWith(req.body.password, 12);
        expect(User).toBeCalledWith(newUser);
        expect(saveSpy).toBeCalled();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            message: `New user, ${newUser.email} added.`,
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should send an error response when save function fails", async () => {
        //Arrange
        req.body = mockUser;
        bcrypt.hash.mockImplementation(() => "encryptedPassword");
        const newUser = { ...mockUser, password: "encryptedPassword" };
        const rejectedPromise = Promise.reject({ message: "Error" });
        const saveSpy = jest.spyOn(User.prototype, "save");
        saveSpy.mockImplementation(() => rejectedPromise);

        //Act
        await authController.postSignUp(req, res, next);

        //Assert
        expect(bcrypt.hash).toBeCalledWith(req.body.password, 12);
        expect(User).toBeCalledWith(newUser);
        expect(saveSpy).toBeCalled();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("authController.postLogin", () => {
    it("should be a function", () => {
        expect(typeof authController.postLogin).toBe("function");
    });
    it("should reject login on wrong credentials", async () => {
        //Arrange
        res.user = { password: "hashedPassword" };
        req.body = { password: "password" };
        bcrypt.compare.mockImplementation(() => false);

        //Act
        await authController.postLogin(req, res, next);

        //Assert
        expect(bcrypt.compare).toBeCalledWith(
            req.body.password,
            res.user.password
        );
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            message: "Login unsuccesful. Invalid password.",
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should create an authenticated session on correct credentials", async () => {
        //Arrange
        res.user = { password: "hashedPassword" };
        req.body = { password: "password" };
        req.session = {
            isLoggedIn: null,
            save: jest.fn(),
        };
        req.session.save.mockImplementation((callback) => callback());
        bcrypt.compare.mockImplementation(() => true);
        const consoleLogSpy = jest.spyOn(console, "log");

        //Act
        await authController.postLogin(req, res, next);
        const saveFunctionArgument = req.session.save.mock.calls[0][0];

        //Assert
        expect(bcrypt.compare).toBeCalledWith(
            req.body.password,
            res.user.password
        );
        expect(req.session.isLoggedIn).toBeTruthy();
        expect(req.session.save).toBeCalledWith(saveFunctionArgument);
        expect(consoleLogSpy).toBeCalled();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Login succesful!" });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors and send a message", async () => {
        //Arrange
        res.user = { password: "hashedPassword" };
        req.body = { password: "password" };
        const rejectedPromise = Promise.reject({ message: "Error" });
        bcrypt.compare.mockImplementation(() => rejectedPromise);

        //Act
        await authController.postLogin(req, res, next);

        //Assert
        expect(bcrypt.compare).toBeCalledWith(
            req.body.password,
            res.user.password
        );
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("authController.getLogout", () => {
    it("should be a function", () => {
        expect(typeof authController.getLogout).toBe("function");
    });
    it("should destroy the session and send a successful response", async () => {
        //Arrange
        req.session = {
            isLoggedIn: true,
            destroy: jest.fn(),
        };
        req.session.destroy.mockImplementation((callback) => callback());
        const consoleLogSpy = jest.spyOn(console, "log");

        //Act
        await authController.getLogout(req, res, next);
        const destroyMockArgument = req.session.destroy.mock.calls[0][0];

        //Assert
        expect(req.session.destroy).toBeCalledWith(destroyMockArgument);
        expect(consoleLogSpy).toBeCalled();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Logout succesful." });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should send a response when user is not logged in.", async () => {
        //Arrange
        req.session = {
            isLoggedIn: false,
        };

        //Act
        await authController.getLogout(req, res, next);

        //Assert
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            message: "Logout unsuccesful, please login first.",
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        //Arrange
        req.session = {
            isLoggedIn: true,
            destroy: jest.fn(),
        };
        req.session.destroy.mockImplementation(() => {
            throw { message: "Error" };
        });

        //Act
        await authController.getLogout(req, res, next);
        const destroyMockArgument = req.session.destroy.mock.calls[0][0];

        //Assert
        expect(req.session.destroy).toBeCalledWith(destroyMockArgument);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("authController.getUserByEmail", () => {
    it("should be a function", () => {
        expect(typeof authController.getUserByEmail).toBe("function");
    });
    it("should get user by email, and set it in response", async () => {
        //Arrange
        req.body = mockUser;
        User.findOne.mockImplementation(() => mockUser);

        //Act
        await authController.getUserByEmail(req, res, next);

        //Assert
        expect(User.findOne).toBeCalledWith({ email: req.body.email });
        expect(res.user).toEqual(mockUser);
        expect(next).toBeCalled();
    });
    it("should send a response when not finding the user", async () => {
        //Arrange
        req.body = mockUser;
        User.findOne.mockImplementation(() => null);

        //Act
        await authController.getUserByEmail(req, res, next);

        //Assert
        expect(User.findOne).toBeCalledWith({ email: req.body.email });
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            message: `User ${req.body.email} not found.`,
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        //Arrange
        req.body = mockUser;
        const rejectedPromise = Promise.reject({ message: "Error" });
        User.findOne.mockImplementation(() => rejectedPromise);

        //Act
        await authController.getUserByEmail(req, res, next);

        //Assert
        expect(User.findOne).toBeCalledWith({ email: req.body.email });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error" });
        expect(res._isEndCalled()).toBeTruthy();
    });
});
