// Importing necessary libraries
const multer = require("multer");
const cloudinary = require("cloudinary");
// const { HttpError } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { HttpError } = require("../utils/http_error");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dr6xjwdik',
  api_key: process.env.CLOUDINARY_API_KEY || "491478372872138",
  api_secret: process.env.CLOUDINARY_API_SECRET || "1avzuAnlq4hRENmxX8MUD4FgpQE",
});

// Setting up multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle single file upload
const multerUpload = upload.single("file");

const uploadImage = asyncHandler(async (req, res, next) => {
  multerUpload(req, res, async (err) => {
    if (err) {
      return next(err);  // Handle errors during multer file upload
    }

    // Check if file is not found in the request
    if (!req.file) {
      throw HttpError.notFound("File not found");
    }

    const fileContent = req.file.buffer;

    // Upload file to Cloudinary
    cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto", public_id: req.file.originalname },
      (error, result) => {
        if (error) {
          return next(error);  // Handle errors during Cloudinary upload
        }

        // Send response with Cloudinary secure URL
        res.json({
          success: true,
          result: result?.secure_url,
        });
      }
    ).end(fileContent);  // End the stream with the file content
  });
});

module.exports = { uploadImage };
