const { Router } = require("express");
const { checkToken } = require("../middlewares/check_token");
const { uploadImage } = require("../controllers/upload");
// const { checkToken, uploadImage } = require("../internal");

const router = Router();

router.post("/", checkToken, uploadImage);

module.exports = { uploadRouter: router };
