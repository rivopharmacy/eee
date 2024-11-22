const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  sales: {
    type: Number,
    default: 0,
    cast: 'Invalid sales type',
  },
  month: {
    type: String,
    cast: "Invalid month Type"
  },
});

const salesModel = mongoose.model("sales", salesSchema);

module.exports = { salesModel, salesSchema };
