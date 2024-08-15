const auth = require("../../../middlewares/auth");
const httpMocks = require("node-mocks-http");

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("auth.isAuth", () => {
    it("should call next when session is authenticated", () => {
        //Arrange
        req.session = {
            isLoggedIn: true,
        };

        //Act
        auth.isAuth(req, res, next);

        //Assert
        expect(next).toBeCalled();
    });
    it("should return an unauthorized response when session is not authenticated", () => {
        //Arrange
        req.session = {
            isLoggedIn: false,
        };

        //Act
        auth.isAuth(req, res, next);

        //Assert
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ message: "Unauthorized access." });
        expect(res._isEndCalled()).toBeTruthy();
    });
});
