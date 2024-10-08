require("dotenv").config();
const session = require("supertest-session");
const server = require("../../server");
const newUnitData = require("../mock-data/mock-unit.json");
const { default: mongoose } = require("mongoose");

const endpointUrl = "/units/";
let testSession;
let mockUnitId;

beforeAll(async () => {
    testSession = session(server.app);
    await testSession.post("/users/login").send({
        email: process.env.TESTUSER,
        password: process.env.TESTPASSWORD,
    });
}, 15000);

afterAll(async () => {
    await testSession.get(endpointUrl + "logout");
    await mongoose.connection.close();
    server.appServer.close();
});

describe(endpointUrl, () => {
    it(`successful request POST ${endpointUrl}`, async () => {
        const response = await testSession.post(endpointUrl).send(newUnitData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(newUnitData);
        mockUnitId = response.body._id;
    }, 15000);
    it(`succesful request on GET ${endpointUrl}`, async () => {
        const response = await testSession.get(endpointUrl);
        expect(response.statusCode).toBe(200);
        response.body.forEach((unit) => {
            expect(unit).toMatchObject({});
        });
    }, 15000);
    it(`succesful request on GET ${endpointUrl}:id`, async () => {
        const response = await testSession.get(`${endpointUrl}${mockUnitId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            _id: mockUnitId,
        });
    }, 15000);
    it(`unit not found request on GET ${endpointUrl}:id`, async () => {
        const notFoundId = "66c20d41f89f9e690f35c789";
        const response = await testSession.get(`${endpointUrl}${notFoundId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "Cannot find unit." });
    }, 15000);
    it(`unsuccesful request on GET ${endpointUrl}:id`, async () => {
        const response = await testSession.get(`${endpointUrl}error`);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toMatch(/Cast to ObjectId failed/);
    }, 15000);
    it(`validation error on POST ${endpointUrl}`, async () => {
        const response = await testSession
            .post(endpointUrl)
            .send({ Error: "oops" });
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toMatch(/unit validation failed/);
    }, 15000);
    it(`succesful request on PATCH ${endpointUrl}:id`, async () => {
        const response = await testSession
            .patch(`${endpointUrl}${mockUnitId}`)
            .send({ name: "updatedName" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ name: "updatedName" });
    }, 15000);
    it(`succesful request on DELETE ${endpointUrl}:id`, async () => {
        const response = await testSession.delete(
            `${endpointUrl}${mockUnitId}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Unit deleted." });
    }, 15000);
});
