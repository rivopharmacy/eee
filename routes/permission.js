const { Router } = require("express");
const { checkBooleanPermission } = require("../utils/permission_check");
const { checkToken } = require("../middlewares/check_token");
const { getPermission, getPermissionById, addPermission, updatePermission, deletePermission } = require("../controllers/permission");
const { pagination } = require("../middlewares/pagination");
const { fetchSingleDocument } = require("../middlewares/single_document");
const { checkNecessaryParameters } = require("../middlewares/check_param");
const { createDocument, updateDocument, deleteDocument } = require("../middlewares/document_operation");
// const {
//   addPermission,
//   checkNecessaryParameters,
//   checkToken,
//   createDocument,
//   deleteDocument,
//   deletePermission,
//   fetchSingleDocument,
//   getPermission,
//   getPermissionById,
//   pagination,
//   updateDocument,
//   updatePermission,
// } = require("../internal");


const router = Router();

router.get(
  "/",
  checkToken,
  checkBooleanPermission(),
  getPermission,
  pagination
);

router.get(
  "/:id",
  checkToken,
  checkBooleanPermission(),
  getPermissionById,
  fetchSingleDocument
);

router.post(
  "/",
  checkToken,
  checkBooleanPermission(),
  checkNecessaryParameters(["name"]),
  addPermission,
  createDocument
);

router.put(
  "/:id",
  checkToken,
  checkBooleanPermission(),
  updatePermission,
  updateDocument
);

router.delete(
  "/:id",
  checkToken,
  checkBooleanPermission(),
  deletePermission,
  deleteDocument
);

module.exports = { permissionRouter: router };
