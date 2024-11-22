const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { getChats, createChat, getChatById, updateChat, deleteChat } = require("../controllers/chat");
const { pagination } = require("../middlewares/pagination");
const { createDocument, updateDocument, deleteDocument } = require("../middlewares/document_operation");
const { fetchSingleDocument } = require("../middlewares/single_document");
// const { 
//     checkToken, 
//     createChat, 
//     createDocument, 
//     deleteChat, 
//     deleteDocument, 
//     fetchSingleDocument, 
//     getChatById,
//     getChats, 
//     pagination, 
//     updateChat,
//     updateDocument
// } = require("../internal");

const router = Router();

router.get('/', checkToken, getChats, pagination);

router.post('/', checkToken, createChat, createDocument);

router.get('/:id', checkToken, getChatById, fetchSingleDocument);

router.put('/:id', checkToken, updateChat, updateDocument);

router.delete('/:id', checkToken, deleteChat, deleteDocument);

module.exports = { chatsRouter: router };
