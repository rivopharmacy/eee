// const {  chatModel, userModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { chatModel } = require("../models/chat");
const { messageModel } = require("../models/message");
const { userModel } = require("../models/user");

const getChats = asyncHandler(
  async (req, resp, next) => {
    req.model = chatModel;
    req.modelName = "chats";
    const user = await userModel.findOne({ _id: req.session.user, isAdmin: false });
    if (user) {
      req.query.user = req.user._id;
    }
    chats = await chatModel.find().populate("user").sort('-updatedAt')
    for (const chat of chats) {
      // Fetch only the last message
      const lastMessage = await messageModel
        .findOne({ chatId: chat._id })
        .sort({ date: -1 })
        .select("text");
      chat.lastMsg = lastMessage ? lastMessage.text : null;

      
  
      const unreadAdminCount = await messageModel.countDocuments({
        chatId: chat._id,
        read: false,
        isUser:true
      });
      chat.adminUnRead = unreadAdminCount;
      const unreadUserCount = await messageModel.countDocuments({
        chatId: chat._id,
        read: false,
        isUser:false
      });
      chat.userUnRead = unreadUserCount;
      await chat.save()
    }

    resp.json({
      success: true,
      result: chats,
    });  }
);

const getChatById = asyncHandler(
  async (req, resp, next) => {
    req.model = chatModel;
    req.modelName = "chats";
    const user = await userModel.findOne({ _id: req.session.user, isAdmin: false });
    if (user) {
      req.query.user = req.user._id;
    }
    req.populate = "user";
    next();
  }
);

const createChat = asyncHandler(
  async (req, resp, next) => {
    req.model = chatModel;
    req.modelName = "chats";
    req.body.user = req.user._id;
    next();
  }
);

const updateChat = asyncHandler(
  async (req, resp, next) => {
    req.model = chatModel;
    req.modelName = "chats";
    next();
  }
);

const deleteChat = asyncHandler(
  async (req, resp, next) => {
    req.model = chatModel;
    req.modelName = "chats";
    next();
  }
);

module.exports = {
  getChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
};
