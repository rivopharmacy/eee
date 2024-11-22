// const {  HttpError, userModel } = require("../internal");

const { userModel } = require('../models/user');
const { HttpError } = require('../utils/http_error');
const {asyncHandler} = require('./async')

const checkToken = asyncHandler(
  async (req, res, next) => {
    if (!req.session.user && (req.session.user || !req.headers['session'])) {
      throw HttpError.invalidTokens();
    }
    const user = await userModel.findOne({ _id: (req.session.user || req.headers['session']) });
    if (!user) {
      throw HttpError.invalidTokens();
    } else if (user.isDisable) {
      throw HttpError.notFound("User not found");
    }
    req.user = user;
    next();
  }
);

module.exports = { checkToken };
