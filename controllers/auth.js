// const { HttpError,  userModel, wishModel } = require("../internal");
const { sendTemplateMail } = require("../utils/send_mail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {asyncHandler} = require("../middlewares/async");
const { HttpError } = require("../utils/http_error");
const {userModel} = require("../models/user")
const {wishModel} = require("../models/wish")

const signIn = asyncHandler(async (req, res, next) => {
  if (typeof req.body.password !== "string" || typeof req.body.email !== "string") {
    throw HttpError.invalidParameters("Password and Email must be of type String");
  }

  let result;
  if (req.body.isAdmin === true) {
    result = await userModel.findOne({ email: req.body.email, isAdmin: true });
  } else {
    result = await userModel.findOne({ email: req.body.email, isAdmin: false });
  }

  if (result) {
    const checkPass = await result.comparePassword(req.body.password);
    if (!checkPass && !result.isSocial) {
      throw HttpError.invalidCredentials();
    } else if (result.isSocial && !checkPass) {
      req.session.user = result._id;
      res.json({ success: true, result });
    } else if (checkPass && !result.isSocial) {
      req.session.user = result._id;
      res.json({ success: true, result });
    }
  } else {
    throw HttpError.invalidCredentials();
  }
});

const socialAuth = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    await userModel.create(req.body);
    const result = await userModel.findOne({ email: req.body.email });
    await wishModel.create({
      user: result._id,
      title: "Favorites",
      products: [],
    });
    req.session.user = result._id;
    res.json({ success: true, result });
  } else {
    req.session.user = user._id;
    res.json({ success: true, user });
  }
});

const signUp = asyncHandler(async (req, res, next) => {
  if (typeof req.body.password !== "string" || typeof req.body.email !== "string") {
    throw HttpError.invalidParameters("Password and Email must be of type String");
  }
  await userModel.create(req.body);
  const result = await userModel.findOne({ email: req.body.email });
  await wishModel.create({
    user: result._id,
    title: "Favorites",
    products: [],
  });
  req.session.user = result._id;
  res.json({ success: true, result });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");
  const result = await userModel.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        resetCode: hashedResetCode,
        resetCodeExpiry: Date.now() + parseInt(process.env.RESET_CODE_EXPIRY) * 60 * 1000,
      },
    },
    { new: true }
  );
  if (!result) {
    throw HttpError.notFound("Email not found");
  }
  const response = await sendTemplateMail("Password Reset", result.email, {
    name: result.firstName,
    verification_code: resetCode,
  });
  res.json(response);
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const newPass = bcrypt.hashSync(req.body.newPassword, parseInt(process.env.SALT_WORK_FACTOR));
  const hashedResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");

  const result = await userModel.findOneAndUpdate(
    {
      resetCode: hashedResetCode,
      resetCodeExpiry: { $gt: Date.now() },
    },
    { $set: { password: newPass, resetCode: null, resetCodeExpiry: null } },
    { new: true }
  );
  if (!result) {
    throw HttpError.invalidParameters("Reset code");
  }
  res.json({ success: true, message: "Password Reset" });
});

const sendEmailVerification = asyncHandler(async (req, res, next) => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");

  const result = await userModel.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        verificationCode: hashedResetCode,
        verificationCodeExpiry: Date.now() + parseInt(process.env.RESET_CODE_EXPIRY) * 60 * 1000,
      },
    },
    { new: true }
  );
  if (!result) {
    throw HttpError.notFound("Email not found");
  }
  const response = await sendTemplateMail("Account Verification", result.email, {
    name: result.firstName,
    verification_code: resetCode,
  });
  res.json(response);
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto.createHash("sha256").update(req.body.verificationCode).digest("hex");

  const result = await userModel.findOneAndUpdate(
    {
      verificationCode: hashedResetCode,
      verificationCodeExpiry: { $gt: Date.now() },
    },
    {
      $set: {
        verificationCode: null,
        verificationCodeExpiry: null,
        emailVerified: true,
      },
    },
    { new: true }
  );
  if (!result) {
    throw HttpError.invalidParameters("Reset code");
  }
  res.json({ success: true, message: "Email Verified" });
});

const signOut = asyncHandler(async (req, res, next) => {
  if (req.session) {
    req.session.destroy(() => {});
  }
  res.json({ success: true });
});

module.exports = {
  signIn,
  signOut,
  signUp,
  sendEmailVerification,
  verifyEmail,
  resetPassword,
  forgotPassword,
  socialAuth,
};
