const { HttpError } = require('./http_error');

const verifyDocument = async (query, model, docName) => {
  // For optional documents
  if (!query._id) {
    return;
  }
  const doc = await model.findOne(query);
  // For throwing error on not finding the document
  if (!doc) {
    throw HttpError.notFound(`${docName} not found`);
  }
  return doc;
};

module.exports = { verifyDocument };
