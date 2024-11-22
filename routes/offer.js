const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { getOffers, createOffer, getOfferById, updateOffer, deleteOffer } = require("../controllers/offer");
const { pagination } = require("../middlewares/pagination");
const { checkNecessaryParameters } = require("../middlewares/check_param");
const { createDocument, updateDocument, deleteDocument } = require("../middlewares/document_operation");
const { fetchSingleDocument } = require("../middlewares/single_document");
// const {
//   checkNecessaryParameters,
//   checkToken,
//   createDocument,
//   createOffer,
//   deleteDocument,
//   deleteOffer,
//   fetchSingleDocument,
//   getOfferById,
//   getOffers,
//   pagination,
//   updateDocument,
//   updateOffer,
// } = require("../internal");

const router = Router();

router.get("/", checkToken, getOffers, pagination);

router.post(
  "/",
  checkToken,
  checkNecessaryParameters([
    "title",
    "description",
    "oldPrice",
    "newPrice",
    "category",
  ]),
  createOffer,
  createDocument
);

router.get("/:id", checkToken, getOfferById, fetchSingleDocument);

router.put("/:id", checkToken, updateOffer, updateDocument);

router.delete("/:id", checkToken, deleteOffer, deleteDocument);

module.exports = { offerRouter: router };
