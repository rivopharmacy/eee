const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { getWish, createWish, getWishByid, deleteWish, updateWish } = require("../controllers/wish");
const { pagination } = require("../middlewares/pagination");
const { createDocument, updateDocument, deleteDocument } = require("../middlewares/document_operation");
const { fetchSingleDocument } = require("../middlewares/single_document");
// const {
//   checkToken,
//   createDocument,
//   createWish,
//   deleteDocument,
//   deleteWish,
//   fetchSingleDocument,
//   getWish,
//   getWishByid,
//   pagination,
//   updateDocument,
//   updateWish,
// } = require("../internal");

const router = Router();

router.get("/", checkToken, getWish, pagination);

router.post("/", checkToken, createWish, createDocument);

router.get("/:id", checkToken, getWishByid, fetchSingleDocument);

router.put("/:id", checkToken, updateWish, updateDocument);

router.delete("/:id", checkToken, deleteWish, deleteDocument);

module.exports = { wishRouter: router };
