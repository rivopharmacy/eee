const {asyncHandler} = require("../middlewares/async");
const { addressModel } = require("../models/address");

const getAddresses = asyncHandler(async (req, resp, next) => {
  req.model = addressModel;
  req.modelName = "addresses";
  req.populate = "user";
  req.query = {
    user: req.user._id,
  };
  next();
});

const getAddressById = asyncHandler(async (req, resp, next) => {
  req.model = addressModel;
  req.modelName = "addresses";
  req.populate = "user";
  next();
});

const createAddress = asyncHandler(async (req, resp, next) => {
  req.model = addressModel;
  req.modelName = "addresses";
  req.body.user = req.user._id;
  next();
});

const updateAddress = asyncHandler(async (req, resp, next) => {
  req.model = addressModel;
  req.modelName = "addresses";
  next();
});

const deleteAddress = asyncHandler(async (req, resp, next) => {
  req.model = addressModel;
  req.modelName = "addresses";
  next();
});

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
