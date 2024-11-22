// const { HttpError,  createLogs, verifyDocument } = require("../internal");
const { createLogs } = require("../controllers/log");
const { sendPushNotification } = require("../controllers/notification");
const { HttpError } = require("../utils/http_error");
const { verifyDocument } = require("../utils/verify_document");
const { asyncHandler } = require("./async");

const createDocument = asyncHandler(
  async (req, res, next) => {
    const result = await req.model.create(req.body);
    if (result) {
      createLogs(
        req.session.user,
        req.modelName,
        "ADD",
        result._id,
        result.toJSON()
      );
      res.json({ success: true, result });
    }
  }
);

const updateDocument = asyncHandler(
  async (req, res, next) => {
    await verifyDocument({ _id: req.params.id }, req.model, req.modelName);
    const result = await req.model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate(req.populate);
    createLogs(
      req.session.user,
      req.modelName,
      "UPDATE",
      result._id,
      result.toJSON()
    );
  if( req.modelName === 'orders'){
    sendPushNotification(
      `Your order status is ${req.body?.status} now!`,
      `Keep in touch with us via our chat support or email, Thank you!`,
      req.session.user,
      null
    );
  }
    res.json({
      success: true,
      result: result,
    });
  }
);

const deleteDocument = asyncHandler(
  async (req, res, next) => {
    await verifyDocument({ _id: req.params.id }, req.model, req.modelName);
    await req.model.deleteOne({ _id: req.params.id });
    createLogs(req.session.user, req.modelName, "DELETE", req.params.id, {});
    res.json({ success: true });
  }
);

const deleteVoucher = asyncHandler(
  async (req, res, next) => {
    await verifyDocument({ _id: req.params.id }, req.model, req.modelName);
    const voucher = await req.model.findOne({ _id: req.params.id });
    if (!voucher) {
      throw HttpError.notFound(`This ${req.modelName} doesn't exists`);
    }
    await voucher.deleteOne();
    createLogs(req.session.user, req.modelName, "DELETE", req.params.id, {});
    res.json({ success: true });
  }
);

module.exports = { createDocument, deleteDocument, deleteVoucher, updateDocument };
