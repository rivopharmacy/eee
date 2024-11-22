const { Router } = require('express');
const { checkToken } = require('../middlewares/check_token');
const { getNotification, createNotification, updateNotification, deleteNotification } = require('../controllers/notification');
const { pagination } = require('../middlewares/pagination');
const { createDocument, updateDocument, deleteDocument } = require('../middlewares/document_operation');
// const { 
//     checkToken,
//     createDocument, 
//     createNotification, 
//     deleteDocument, 
//     deleteNotification, 
//     getNotification, 
//     pagination, 
//     updateDocument, 
//     updateNotification 
// } = require('../internal');

const router = Router();

router.get('/', checkToken, getNotification, pagination);

router.post('/', checkToken, createNotification, createDocument);

router.put('/:id', checkToken, updateNotification, updateDocument);

router.delete('/:id', checkToken, deleteNotification, deleteDocument);

module.exports = { notificationRouter: router };
