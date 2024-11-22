const { HttpError } = require("../utils/http_error");
const { verifyDocument } = require("../utils/verify_document");
const { asyncHandler } = require("./async");
// const { HttpError, verifyDocument } = require("../internal");

const fetchSingleDocument = asyncHandler(
  async (req, res, next) => {
    // Verify if the document exists using the ID
    await verifyDocument({ _id: req.params.id }, req.model, req.modelName);

    // Fetch the document by its ID with query params and populate associated data
    const result = await req.model
      .findById(req.params.id, { ...req.query })
      .populate(req.populate);

    // If document not found, throw an error
    if (!result) {
      throw HttpError.notFound("Document Not Found");
    }

    // Respond with the fetched document
    res.json({
      success: true,
      result,
    });
  }
);

module.exports = { fetchSingleDocument };
