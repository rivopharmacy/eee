// const {  wishModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { wishModel } = require("../models/wish");

const getWish = asyncHandler(async (req, res, next) => {
  req.model = wishModel;
  req.modelName = "wishes";
  req.populate = 'products';
  req.query.user = req.user._id;
  next();
});

const getWishByid = asyncHandler(async (req, res, next) => {
  req.model = wishModel;
  req.modelName = "wishes";
  req.populate = 'products';
  req.query.user = req.user._id;
  next();
});

const createWish = asyncHandler(async (req, res, next) => {
  req.model = wishModel;
  req.modelName = "wishes";
  req.body.user = req.user._id;
  next();
});

const updateWish = asyncHandler(async (req, res, next) => {
  req.model = wishModel;
  req.modelName = "wishes";
  req.populate = 'products';
  next();
});

const deleteWish = asyncHandler(async (req, res, next) => {
  req.model = wishModel;
  req.modelName = "wishes";
  next();
});

module.exports = {
  getWish,
  getWishByid,
  createWish,
  updateWish,
  deleteWish,
};
