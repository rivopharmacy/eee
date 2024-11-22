// const {  offerModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { offerModel } = require("../models/offer");

const getOffers = asyncHandler(
  async (req, res, next) => {
    req.model = offerModel;
    req.modelName = 'offers';
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

const getOfferById = asyncHandler(
  async (req, res, next) => {
    req.model = offerModel;
    req.modelName = 'offers';
    next();
  }
);

const createOffer = asyncHandler(
  async (req, res, next) => {
    req.model = offerModel;
    req.modelName = 'offers';
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

const updateOffer = asyncHandler(
  async (req, res, next) => {
    req.model = offerModel;
    req.modelName = 'offers';
    next();
  }
);

const deleteOffer = asyncHandler(
  async (req, res, next) => {
    req.model = offerModel;
    req.modelName = 'offers';
    next();
  }
);

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
