const { Router } = require('express');
const { checkToken } = require('../middlewares/check_token');
const { getMessages, updateMessage, deleteMessage, getMessagesByChatId } = require('../controllers/message');
const { pagination } = require('../middlewares/pagination');
const { updateDocument, deleteDocument } = require('../middlewares/document_operation');
// const { 
//     checkToken, 
//     deleteDocument, 
//     deleteMessage, 
//     getMessages, 
//     pagination, 
//     updateDocument,
//     updateMessage
// } = require('../internal');

const router = Router();

router.get('/', checkToken, getMessages, pagination);

router.get('/:chatId', checkToken, getMessagesByChatId);


router.put('/:id', checkToken, updateMessage, updateDocument);

router.delete('/:id', checkToken, deleteMessage, deleteDocument);

module.exports = { messageRouter: router };
