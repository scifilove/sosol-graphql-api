const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

exports.getUserId = (ctx, throwIfUnauth = true) => {
  const token = ctx.req.headers.authorization;
  if (token) {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return userId;
  }

  if (throwIfUnauth) {
    throw Error("You need to be authenticated.");
  }

  return false
};

exports.getSignedS3URL = async ({ file, type, expires }) => {
  AWS.config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION || "us-west-2",
    signatureVersion: "v4",
  });

  const s3 = new AWS.S3();

  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    ACL: "public-read",
    Key: file,
    Bucket: process.env.AWS_BUCKET_NAME,
    Expires: expires || 600, // S3 default is 900 seconds (15 minutes)\
    ContentType: type,
    // ContentDisposition: "inline",
  });

  return signedUrl;
};
