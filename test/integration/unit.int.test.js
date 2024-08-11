const request = require("supertest");
const server = require("../../server");
const mongoDatabase = require("../../utils/mongoDatabase");
const newUnitData = require("../mock-data/mock-unit.json");

const endpointUrl = "/units/";
let mockUnitId;

describe(endpointUrl, () => {
    it(`succesful request on GET ${endpointUrl}`, async () => {
        const response = await request(server).get(endpointUrl);
        expect(response.statusCode).toBe(200);
        response.body.forEach((unit) => {
            expect(unit).toMatchObject({});
        });
    });
    it(`succesful request on GET ${endpointUrl}/:id`, async () => {
        const response = await request(server).get(
            `${endpointUrl}66b8db546038f9a67aa1c6d8`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            _id: "66b8db546038f9a67aa1c6d8",
        });
    });
    it(`unit not found request on GET ${endpointUrl}/:id`, async () => {
        const response = await request(server).get(
            `${endpointUrl}66b8deb1b49b84ade643e9e8`
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "Cannot find unit." });
    });
    it(`unsuccesful request on GET ${endpointUrl}/:id`, async () => {
        const response = await request(server).get(`${endpointUrl}error`);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toMatch(/Cast to ObjectId failed/);
    });
    it(`successful request POST ${endpointUrl}`, async () => {
        const response = await request(server)
            .post(endpointUrl)
            .send(newUnitData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(newUnitData);
        mockUnitId = response.body._id;
    }, 10000);
    it(`validation error on POST ${endpointUrl}`, async () => {
        const response = await request(server)
            .post(endpointUrl)
            .send({ Error: "oops" });
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toMatch(/unit validation failed/);
    }, 10000);
    it(`succesful request on PATCH ${endpointUrl}/:id`, async () => {
        const response = await request(server)
            .patch(`${endpointUrl}${mockUnitId}`)
            .send({ name: "updatedName" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ name: "updatedName" });
    });
    it(`succesful request on DELETE ${endpointUrl}/:id`, async () => {
        const response = await request(server).delete(
            `${endpointUrl}${mockUnitId}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Unit deleted." });
    });
});
