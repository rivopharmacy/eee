const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { getUser, getAllUsers, createUser, updateUser, addFcmToken, deleteUser, getUserById } = require("../controllers/user");
const { checkBooleanPermission } = require("../utils/permission_check");
const { pagination } = require("../middlewares/pagination");
const { checkNecessaryParameters } = require("../middlewares/check_param");
const { cleanUpdates } = require("../middlewares/clean_update");
// const {
//   addFcmToken,
//   checkBooleanPermission,
//   checkNecessaryParameters,
//   checkToken,
//   cleanUpdates,
//   createUser,
//   deleteUser,
//   getAllUsers,
//   getUser,
//   getUserById,
//   pagination,
//   updateUser,
// } = require("../internal");

const router = Router();

router.get("/profile", checkToken, getUser);

router.get(
  "/",
  checkToken,
  checkBooleanPermission(),
  getAllUsers,
  pagination
);

router.post(
  "/",
  checkToken,
  checkNecessaryParameters([
    "email",
    "password",
    "contactNumber",
    "firstName",
    "lastName",
  ]),
  checkBooleanPermission(),
  cleanUpdates(["isDisable", "_id"]),
  createUser
);

router.put(
  "/:id",
  checkToken,
  cleanUpdates(["email", "password", "isDisable", "contactNumber", "_id"]),
  updateUser
);

router.post(
  "/add-token",
  checkToken,
  checkNecessaryParameters(['fcmToken']),
  addFcmToken
);

router.delete(
  "/:id",
  checkToken,
  checkBooleanPermission(),
  deleteUser
);

router.get("/:id", checkToken, getUserById);

module.exports = { userRouter: router };
