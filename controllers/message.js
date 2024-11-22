// const {  messageModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { messageModel } = require("../models/message");

const getMessages = asyncHandler(
  async (req, resp, next) => {
    req.model = messageModel;
    req.modelName = 'messages';
    next();
  }
);

const updateMessage = asyncHandler(
  async (req, resp, next) => {
    req.model = messageModel;
    req.modelName = 'messages';
    next();
  }
);



const getMessagesByChatId = asyncHandler(
  async (req, res, next) => {

    const chatId = req.params.chatId
    const messages = await messageModel.find({ chatId: chatId });
    
    res.json({
      success: true,
      result: messages,
    });
  
  }
);

const deleteMessage = asyncHandler(
  async (req, resp, next) => {
    req.model = messageModel;
    req.modelName = 'messages';
    next();
  }
);

module.exports = {
  getMessages,
  updateMessage,
  deleteMessage,
  getMessagesByChatId
};
