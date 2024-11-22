// const {  permissionModel, userModel, HttpError } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { permissionModel } = require("../models/permission");
const { userModel } = require("../models/user");
const { HttpError } = require("../utils/http_error");

const getPermission = asyncHandler(
  async (req, res, next) => {
    if (req.query.name) {
      const name = req.query.name;
      delete req.query["name"];
      req.query = { name: { $regex: name.toString(), $options: "i" } };
    }
    req.model = permissionModel;
    next();
  }
);

const getPermissionById = asyncHandler(
  async (req, res, next) => {
    req.model = permissionModel;
    req.modelName = "permissions";
    next();
  }
);

const addPermission = asyncHandler(
  async (req, res, next) => {
    req.model = permissionModel;
    next();
  }
);

const updatePermission = asyncHandler(
  async (req, res, next) => {
    req.model = permissionModel;
    req.modelName = "permissions";
    next();
  }
);

const deletePermission = asyncHandler(
  async (req, res, next) => {
    const user = await userModel.findOne({ permission: req.params.id });
    if (user) {
      HttpError.referenceError("One or more users refer to this permission");
    } else {
      req.model = permissionModel;
      req.modelName = "permissions";
      next();
    }
  }
);

module.exports = {
  addPermission,
  deletePermission,
  getPermission,
  getPermissionById,
  updatePermission,
};
