require("dotenv").config();
const httpMocks = require("node-mocks-http");
const s3Controller = require("../../../controllers/s3Controller");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("@aws-sdk/client-s3");

let req, res, next;
const clientConfig = {
    region: process.env.AWSREGION,
    credentials: {
        accessKeyId: process.env.AWSACCESS,
        secretAccessKey: process.env.AWSSECRET,
    },
};

class S3ClientMock {
    constructor() {
        this.test = "mock";
    }
}

class PutObjectCommandMock {
    constructor() {
        this.test = "mock";
    }
}

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("s3Controller.getPresignedUrl", () => {
    it("should return a presigned url for the given splash_art folder", async () => {
        //Arrange
        const client = new S3ClientMock();
        const command = new PutObjectCommandMock();
        getSignedUrl.mockReturnValue("url");
        S3Client.mockReturnValue(client);
        PutObjectCommand.mockReturnValue(command);
        req.params = {
            folder: "splash_art",
            name: "test",
        };
        const putObjectParams = {
            Bucket: process.env.S3BUCKETNAME,
            Key: `${req.params.folder}/${req.params.name}.png`,
            ContentType: "image/png",
        };

        //Act
        await s3Controller.getPresignedUrl(req, res);

        //Assert
        expect(S3Client).toBeCalledWith(clientConfig);
        expect(PutObjectCommand).toBeCalledWith(putObjectParams);
        expect(getSignedUrl).toBeCalledWith(client, command, {
            expiresIn: 600,
        });
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ presignedUrl: "url" });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return a response when presigned url was not obtained", async () => {
        //Arrange
        const client = new S3ClientMock();
        const command = new PutObjectCommandMock();
        getSignedUrl.mockReturnValue(null);
        S3Client.mockReturnValue(client);
        PutObjectCommand.mockReturnValue(command);
        req.params = {
            folder: "pixel_art",
            name: "test",
        };
        const putObjectParams = {
            Bucket: process.env.S3BUCKETNAME,
            Key: `${req.params.folder}/${req.params.name}.png`,
            ContentType: "image/png",
        };

        //Act
        await s3Controller.getPresignedUrl(req, res);

        //Assert
        expect(S3Client).toBeCalledWith(clientConfig);
        expect(PutObjectCommand).toBeCalledWith(putObjectParams);
        expect(getSignedUrl).toBeCalledWith(client, command, {
            expiresIn: 600,
        });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            message:
                "Server error, it was not possible to obtain presigned url.",
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors and return a error message", async () => {
        //Arrange
        const rejectedPromise = Promise.reject({ message: "Error" });
        const client = new S3ClientMock();
        const command = new PutObjectCommandMock();
        getSignedUrl.mockReturnValue(rejectedPromise);
        S3Client.mockReturnValue(client);
        PutObjectCommand.mockReturnValue(command);
        req.params = {
            folder: "pixel_art",
            name: "test",
        };
        const putObjectParams = {
            Bucket: process.env.S3BUCKETNAME,
            Key: `${req.params.folder}/${req.params.name}.png`,
            ContentType: "image/png",
        };

        //Act
        await s3Controller.getPresignedUrl(req, res);

        //Assert
        expect(S3Client).toBeCalledWith(clientConfig);
        expect(PutObjectCommand).toBeCalledWith(putObjectParams);
        expect(getSignedUrl).toBeCalledWith(client, command, {
            expiresIn: 600,
        });
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            message: "Error",
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
});
