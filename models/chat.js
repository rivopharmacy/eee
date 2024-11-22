const mongoose = require("mongoose");
const { messageModel } = require("./message");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    cast: "Invalid user type",
  },
  closed: {
    type: Boolean,
    default: false,
    cast: "Invalid closed type",
  },
  lastMsg: {
    type: String,
  },
  userUnRead: {
    type: Number,
    default: 0,
  },
  adminUnRead: {
    type: Number,
    default: 0,
  },
  userLastSeen: {
    type: Date,
    cast: "Invalid userLastSeen type",
  },
  adminLastSeen: {
    type: Date,
    cast: "Invalid adminLastSeen type",
  },
},{ timestamps: true });


const chatModel = mongoose.model("chats", chatSchema);

module.exports = { chatModel, chatSchema };
