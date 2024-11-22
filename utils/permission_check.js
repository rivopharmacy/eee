// const { HttpError } = require("../internal");

const {asyncHandler} = require("../middlewares/async");
const { HttpError } = require("./http_error");

const checkBooleanPermission = () => 
  asyncHandler(async (req, res, next) => {
    const isAdminPermission = req.user.isAdmin === true;
    if (isAdminPermission) {
      next();
    } else {
      throw HttpError.unAuthorized();
    }
  });

module.exports = { checkBooleanPermission };
