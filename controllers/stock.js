// const {  stockModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { stockModel } = require("../models/stock");

const getStock = asyncHandler(
  async (req, res, next) => {
    req.model = stockModel;
    next();
  }
);

const getStockById = asyncHandler(
  async (req, res, next) => {
    req.model = stockModel;
    req.modelName = "stocks";
    next();
  }
);

const addStock = asyncHandler(
  async (req, res, next) => {
    req.model = stockModel;
    req.modelName = "stocks";
    next();
  }
);

const updateStock = asyncHandler(
  async (req, res, next) => {
    req.model = stockModel;
    req.modelName = "stocks";
    next();
  }
);

const deleteStock = asyncHandler(
  async (req, res, next) => {
    req.model = stockModel;
    req.modelName = "stocks";
    next();
  }
);

module.exports = {
  addStock,
  deleteStock,
  getStock,
  getStockById,
  updateStock,
};
