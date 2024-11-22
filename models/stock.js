const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    cast: 'Invalid productId type',
  },
  remainingQuantity: {
    type: Number,
    cast: "Invalid remainingQuantity Type"
  },
});

const stockModel = mongoose.model("stocks", stockSchema);

module.exports = { stockModel, stockSchema };
