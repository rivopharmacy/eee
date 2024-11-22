const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      cast: "Invalid userId type"
    },
    cardHolderName: {
      type: String,
      cast: "cardHolderName datatype is incorrect",
    },
    cvc: {
      type: Number,
      cast: "cvc datatype is incorrect",
    },
    cardNumber: {
      type: Number,
      cast: "cardNumber datatype is incorrect",
    },
    expiry: {
      type: Date,
      cast: "expiry datatype is incorrect",
    },
  },
  { timestamps: false, versionKey: false }
);

const cardModel = mongoose.model('cards', cardSchema);

module.exports = { cardModel, cardSchema };
