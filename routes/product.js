const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/product");
const { pagination } = require("../middlewares/pagination");
const { checkNecessaryParameters } = require("../middlewares/check_param");
const { createDocument, updateDocument, deleteDocument } = require("../middlewares/document_operation");
const { fetchSingleDocument } = require("../middlewares/single_document");
// const { 
//     checkNecessaryParameters,
//     checkToken, 
//     createDocument, 
//     createProduct, 
//     deleteDocument, 
//     deleteProduct, 
//     fetchSingleDocument, 
//     getProductById, 
//     getProducts, 
//     pagination, 
//     updateDocument, 
//     updateProduct 
// } = require("../internal");

const router = Router();

router.get('/', checkToken, getProducts, pagination);

router.post('/', 
    checkToken, 
    checkNecessaryParameters(['title', 'description', 'price',  'category']), 
    createProduct, 
    createDocument
);

router.get('/:id', checkToken, getProductById, fetchSingleDocument);

router.put('/:id', checkToken, updateProduct, updateDocument);

router.delete('/:id', checkToken, deleteProduct, deleteDocument);

module.exports = { productRouter: router };
