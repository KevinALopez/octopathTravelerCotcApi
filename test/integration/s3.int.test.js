require("dotenv").config();
const session = require("supertest-session");
const server = require("../../server");
const { default: mongoose } = require("mongoose");

const endpointUrl = "/s3/";
let authSession;

beforeAll(async () => {
    authSession = session(server);
    await authSession.post("/users/login").send({
        email: process.env.TESTUSER,
        password: process.env.TESTPASSWORD,
    });
}, 10000);

afterAll(async () => {
    await authSession.get(endpointUrl + "logout");
    mongoose.connection.close();
});

describe(endpointUrl, () => {
    it(`succesful request on GET ${endpointUrl}presignedUrl`, async () => {
        const folderName = "pixel_art";
        const unitName = "unitName";
        const expectedUrl = `https://${process.env.S3BUCKETNAME}.s3.${process.env.AWSREGION}.amazonaws.com/${folderName}/${unitName}.png`;
        const response = await authSession.get(
            `${endpointUrl}presignedUrl/${folderName}/${unitName}`
        );

        const expectedUrlRegex = new RegExp(expectedUrl);

        expect(response.statusCode).toBe(200);
        expect(response.body.presignedUrl).toMatch(expectedUrlRegex);
    }, 15000);
});
