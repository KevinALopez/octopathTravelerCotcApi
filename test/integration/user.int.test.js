const session = require("supertest-session");
const server = require("../../server");
const User = require("../../models/user");
const intTestUser = require("../mock-data/mock-userIntTest.json");
const { default: mongoose } = require("mongoose");

const endpointUrl = "/users/";
let testSession = null;

beforeAll((done) => {
    testSession = session(server);
    done();
});

afterAll(async () => {
    await User.findOneAndDelete({ email: intTestUser.email });
    mongoose.connection.close();
});

describe(endpointUrl, () => {
    it(`succesful request on POST ${endpointUrl}signup`, async () => {
        const response = await testSession
            .post(endpointUrl + "signup")
            .send(intTestUser);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: `New user, ${intTestUser.email} added.`,
        });
    }, 15000);
    it(`succesful request on POST ${endpointUrl}login`, async () => {
        const res = await testSession
            .post(endpointUrl + "login")
            .send(intTestUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Login succesful!" });
    });
    it(`should logout on succesful GET ${endpointUrl}logout`, async () => {
        const res = await testSession.get(endpointUrl + "logout");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Logout succesful." });
    });
});
