const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      cast: "Invalid user ID",
    },
    modelName: {
      type: String,
      cast: "modelName datatype is incorrect",
    },
    method: {
      type: String,
      cast: "method datatype is incorrect",
    },
    rowId: {
      type: mongoose.Schema.Types.Mixed,
      cast: "rowId datatype is incorrect",
    },
    columnAffected: {
      type: mongoose.Schema.Types.Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true, versionKey: false }
);

const logModel = mongoose.model("logs", logSchema);

module.exports = { logModel, logSchema };
