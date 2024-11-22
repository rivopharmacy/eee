const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    cast: 'Invalid chatId type',
  },
  image: {
    type: String,
    cast: 'Invalid image type',
  },
  text: {
    type: String,
    cast: 'Invalid text Type',
  },
  date: {
    type: Date,
    cast: 'Invalid date Type',
  },
  read: {
    type: Boolean,
    cast: 'Invalid read Type',
    default: false,
  },
  isUser: {
    type: Boolean,
    cast: 'Invalid isUser Type',
  }
});

const messageModel = mongoose.model('messages', messageSchema);

module.exports = { messageModel, messageSchema };
