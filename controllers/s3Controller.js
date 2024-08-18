require("dotenv").config();
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

exports.getPresignedUrl = async (req, res) => {
    try {
        const client = new S3Client({
            region: process.env.AWSREGION,
            credentials: {
                accessKeyId: process.env.AWSACCESS,
                secretAccessKey: process.env.AWSSECRET,
            },
        });

        const folder =
            req.params.folder === "splash_art" ? "splash_art" : "pixel_art";

        const putObjectParams = {
            Bucket: process.env.S3BUCKETNAME,
            Key: `${folder}/${req.params.name}.png`,
            ContentType: "image/png",
        };

        const command = new PutObjectCommand(putObjectParams);

        const url = await getSignedUrl(client, command, { expiresIn: 600 });

        if (url) {
            return res.status(200).json({ presignedUrl: url });
        }

        return res.status(500).json({
            message:
                "Server error, it was not possible to obtain presigned url.",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
