const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { checkNecessaryParameters } = require("../middlewares/check_param");
const { addPayment, addCard, getCards } = require("../controllers/payment");
const { createDocument } = require("../middlewares/document_operation");
const { pagination } = require("../middlewares/pagination");
// const { 
//     addCard, 
//     addPayment, 
//     checkNecessaryParameters, 
//     checkToken, 
//     createDocument, 
//     getCards, 
//     pagination 
// } = require("../internal");

const router = Router();

router.post(
    '/', 
    checkToken, 
    checkNecessaryParameters(['amount','currency']), 
    addPayment
);

router.post(
    '/card', 
    checkToken, 
    addCard,
    createDocument,
);

router.get(
    '/cards', 
    checkToken,
    getCards,
    pagination,
);

module.exports = { paymentRouter: router };
