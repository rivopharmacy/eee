const { Server } = require("socket.io");
const { chatModel } = require("../models/chat");
const { messageModel } = require("../models/message");
// const { HttpError, , userModel } = require("../internal");
const { HttpError } = require("../utils/http_error");
const { userModel } = require("../models/user");
const { sendPushNotification } = require("./notification");

const chatSupport = (io) => {
  io.on("connection", (socket) => {
    socket.on("error", (error) => {
      console.error("Socket.io error:", error);
    });

    socket.on("adminJoinRoom", async (data) => {
      try {
        const user = await userModel.findOne({
          _id: data.userId,
          isAdmin: true,
        });
        if (!user) {
          throw HttpError.unAuthorized();
        }
        const chat = await chatModel.findOne({
          _id: data.chatId,
          closed: false,
        });
        if (!chat) {
          throw HttpError.notFound("Chat");
        }
        socket.join(chat._id.toString());
        console.log("Admin Joined room successfully!");
        const messages = await messageModel.find({ isUser: true, read: false });

        for (const message of messages) {
          message.read = true;
          await message.save();
        }
        chat.adminUnRead = 0
        await chat.save()
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("userJoinRoom", async (data) => {
      try {
        const user = await userModel.findOne({
          _id: data.userId,
          isAdmin: false,
        });
        if (!user) {
          throw HttpError.notFound("User");
        }
        const chat = await chatModel.findOne({
          _id: data.chatId,
          user: data.userId,
          closed: false,
        });
        if (!chat) {
          throw HttpError.notFound("Chat");
        }
        socket.join(chat._id.toString());
        console.log("User Joined room successfully!");
        const messages = await messageModel.find({ isUser: false, read: false });

        for (const message of messages) {
          message.read = true;
          await message.save();
        }
        chat.userUnRead = 0
        await chat.save()
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("sendUserMessage", async (data) => {
      try {
        const chat = await chatModel.findOne({
          _id: data.chatId,
          user: data.userId,
          closed: false,
        });
        if (chat) {
          data["date"] = Date.now();
          const message = await messageModel.create(data);
          io.to(data.chatId.toString()).emit(
            "newUserMessage",
            message.toJSON()
          );
          console.log("User Message sent successfully!");
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("sendAdminMessage", async (data) => {
      try {
        const user = await userModel.findOne({
          _id: data.userId,
          isAdmin: true,
        });
        if (!user) {
          throw HttpError.notFound("User");
        }
        const chat = await chatModel.findOne({
          _id: data.chatId,
          closed: false,
        });
        if (chat) {
          data["date"] = Date.now();
          const message = await messageModel.create(data);
          io.to(data.chatId.toString()).emit(
            "newAdminMessage",
            message.toJSON()
          );
          `${user.firstName}`, `${message.text}`, chat.user, null;
          console.log("Admin Message sent successfully!");
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("leaveRoomUser", async (data) => {
      try {
        const chat = await chatModel.findOne({
          user: data.userId,
          closed: false,
        });
        if (!chat) {
          throw HttpError.notFound("Chat not found!");
        }
        socket.leave(chat._id);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("leaveRoomAdmin", (data) => {
      socket.leave(data.chatId.toString());
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = { chatSupport };
