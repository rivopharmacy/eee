const { Schema } = require("mongoose");
// const {  logModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { logModel } = require("../models/log");

const createLogs = async (userId, schemaName, method, rowId, columns) => {
  try {
    await logModel.create({
      user: userId,
      modelName: schemaName,
      method: method,
      rowId: rowId,
      columnAffected: columns,
    });
  } catch (err) {
    console.log("msg: " + err + ", code: " + " invalid-error" + ", status: " + 500);
  }
};

const getLogs = asyncHandler(
  async (req, res, next) => {
    req.model = logModel;
    next();
  }
);

module.exports = { createLogs, getLogs };
