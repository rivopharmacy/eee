const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { getStock, getStockById, addStock, updateStock, deleteStock } = require("../controllers/stock");
const { pagination } = require("../middlewares/pagination");
const { fetchSingleDocument } = require("../middlewares/single_document");
const { checkBooleanPermission } = require("../utils/permission_check");
const { createDocument, updateDocument, deleteDocument } = require("../middlewares/document_operation");
// const { 
//     addStock,
//     checkBooleanPermission,
//     checkToken, 
//     createDocument, 
//     deleteDocument, 
//     deleteStock, 
//     fetchSingleDocument, 
//     getStock, 
//     getStockById, 
//     pagination, 
//     updateDocument, 
//     updateStock
// } = require("../internal");

const router = Router();

router.get("/", checkToken, getStock, pagination);

router.get("/:id", checkToken, getStockById, fetchSingleDocument);

router.post("/", checkToken, checkBooleanPermission(), addStock, createDocument);

router.put("/:id", checkToken, checkBooleanPermission(), updateStock, updateDocument);

router.delete("/:id", checkToken, checkBooleanPermission(), deleteStock, deleteDocument);

module.exports = { stockRouter: router };
