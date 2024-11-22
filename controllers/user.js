// const {  createLogs, userModel, verifyDocument } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { userModel } = require("../models/user");
const { verifyDocument } = require("../utils/verify_document");
const { createLogs } = require("./log");

const getAllUsers = asyncHandler(async (req, res, next) => {
  if (req.query.firstName) {
    const firstName = req.query.firstName;
    delete req.query["firstName"];
    req.query.firstName = { $regex: firstName.toString(), $options: "i" };
  }
  if (req.query.lastName) {
    const lastName = req.query.lastName;
    delete req.query["lastName"];
    req.query.lastName = { $regex: lastName.toString(), $options: "i" };
  }
  if (req.query.email) {
    const email = req.query.email;
    delete req.query["email"];
    req.query.email = { $regex: email.toString(), $options: "i" };
  }
  req.model = userModel;
  next();
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({ _id: req.params.id })
    .populate("addresses");
  const newUser = user.toJSON();
  res.json({ success: true, result: newUser });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({ _id: req.session.user })
    .populate("addresses");
  const newUser = user.toJSON();
  res.json({ success: true, result: newUser });
});

const updateUser = asyncHandler(async (req, res, next) => {
  await verifyDocument({ _id: req.params.id }, userModel, "user");
  await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  await verifyDocument({ _id: req.params.id }, userModel, "user");
  await userModel.findByIdAndDelete(req.params.id,);
  createLogs(req.session.user, "users", "DELETE", req.params.id, {});
  res.json({ success: true });
});

const addFcmToken = asyncHandler(async (req, res, next) => {
  const token = req.body.fcmToken;
  if (token && token.length > 10) {
    const result = await userModel.findByIdAndUpdate(
      { _id: req.user._id },
      { $addToSet: { fcmTokens: token } },
      { new: true }
    );

    if (result) {
      res.json({
        success: true,
        result,
      });
    }
  }
});

const createUser = asyncHandler(async (req, res, next) => {
  const result = await userModel.create(req.body);
  res.json({
    success: true,
    result,
  });
});

module.exports = {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserById,
  updateUser,
  addFcmToken,
};
