// const {  productModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { productModel } = require("../models/product");

const getProducts = asyncHandler(
  async (req, res, next) => {
    req.model = productModel;
    req.modelName = 'products';
    if (req.query.title) {
      const title = req.query.title;
      delete req.query["title"];
      const isArabic = /[\u0600-\u06FF]/.test(title)
      if (isArabic) {
        req.query['title.ar'] = { $regex: title, $options: "i" };
      } else {
        req.query['title.en'] = { $regex: title, $options: "i" };
      }
    }
    next();
  }
);

const getProductById = asyncHandler(
  async (req, res, next) => {
    req.model = productModel;
    req.modelName = 'products';
    next();
  }
);

const createProduct = asyncHandler(
  async (req, res, next) => {
    req.model = productModel;
    req.modelName = 'products';
    const { title, description } = req.body;
    // Set both Arabic and English translations in the request body
    req.body = {
      ...req.body,
      title: { en: title.en, ar: title.ar },
      description: { en: description.en, ar: description.ar },
    };
    next();
  }
);

const updateProduct = asyncHandler(
  async (req, res, next) => {
    req.model = productModel;
    req.modelName = 'products';
    next();
  }
);

const deleteProduct = asyncHandler(
  async (req, res, next) => {
    req.model = productModel;
    req.modelName = 'products';
    next();
  }
);

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
