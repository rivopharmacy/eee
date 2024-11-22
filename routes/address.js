const { getAddresses, createAddress, getAddressById, updateAddress, deleteAddress } = require("../controllers/address");
const { checkNecessaryParameters } = require("../middlewares/check_param");
const { checkToken } = require("../middlewares/check_token");
const { createDocument, updateDocument, deleteDocument } = require("../middlewares/document_operation");
const { pagination } = require("../middlewares/pagination");
const { fetchSingleDocument } = require("../middlewares/single_document");

const Router = require("express").Router;
// const { 
//     checkNecessaryParameters,
//     checkToken, 
//     createAddress, 
//     createDocument, 
//     deleteAddress, 
//     deleteDocument, 
//     fetchSingleDocument, 
//     getAddressById, 
//     getAddresses, 
//     pagination, 
//     updateAddress, 
//     updateDocument 
// } = require("../internal");

const router = Router();

// Get all addresses with pagination and token check
router.get('/', checkToken, getAddresses, pagination );

// Create a new address, requires specific parameters, and a token check
router.post('/', checkToken, createAddress, checkNecessaryParameters(['streetAddress', 'user', 'city', 'state']), createDocument );

// Get a single address by its ID with token check
router.get('/:id', checkToken, getAddressById, fetchSingleDocument );

// Update an address by its ID, token check included
router.put('/:id', checkToken, updateAddress, updateDocument );

// Delete an address by its ID, token check included
router.delete('/:id', checkToken, deleteAddress, deleteDocument );

module.exports = { addressRouter: router };
