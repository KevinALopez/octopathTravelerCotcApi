require("dotenv").config();
const session = require("supertest-session");
const server = require("../../server");
const { default: mongoose } = require("mongoose");

const endpointUrl = "/users/";
const intTestUser = {
    email: process.env.TESTUSER,
    password: process.env.TESTPASSWORD,
};
let testSession = null;

beforeAll((done) => {
    testSession = session(server.app);
    done();
});

afterAll(async () => {
    await mongoose.connection.close();
    server.appServer.close();
});

describe(endpointUrl, () => {
    // it(`succesful request on POST ${endpointUrl}signup`, async () => {
    //     const response = await testSession
    //         .post(endpointUrl + "signup")
    //         .send(intTestUser);

    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toEqual({
    //         message: `New user, ${intTestUser.email} added.`,
    //     });
    // }, 15000);
    it(`succesful request on POST ${endpointUrl}login`, async () => {
        const res = await testSession
            .post(endpointUrl + "login")
            .send(intTestUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Login succesful!" });
    }, 15000);
    it(`should logout on succesful GET ${endpointUrl}logout`, async () => {
        const res = await testSession.get(endpointUrl + "logout");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Logout succesful." });
    });
});
