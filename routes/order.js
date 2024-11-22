const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { getOrders, createOrder, getOrderSummary, getOrderById, updateOrder, deleteOrder, getOrdersSales, getOrdersCost, getOrdersProfit } = require("../controllers/order");
const { pagination } = require("../middlewares/pagination");
const { checkNecessaryParameters } = require("../middlewares/check_param");
const { fetchSingleDocument } = require("../middlewares/single_document");
const { updateDocument, deleteDocument } = require("../middlewares/document_operation");
// const {
//   checkNecessaryParameters,
//   checkToken,
//   createOrder,
//   deleteDocument,
//   deleteOrder,
//   fetchSingleDocument,
//   getOrderById,
//   getOrders,
//   getOrderSummary,
//   pagination,
//   updateDocument,
//   updateOrder,
// } = require("../internal");

const router = Router();

router.get("/", checkToken, getOrders, pagination);

router.post(
  "/",
  checkToken,
  checkNecessaryParameters([
    "products",
    "total",
    "subTotal",
    "shippingCost",
    "tax",
    "address",
  ]),
  createOrder
);

router.get("/summary", checkToken, getOrderSummary);
router.get("/sales", checkToken, getOrdersSales);
router.get("/cost", checkToken, getOrdersCost);
router.get("/profit", checkToken, getOrdersProfit);




router.get("/:id", checkToken, getOrderById, fetchSingleDocument);

router.put("/:id", checkToken, updateOrder, updateDocument);

router.delete("/:id", checkToken, deleteOrder, deleteDocument);

module.exports = { orderRouter: router };
