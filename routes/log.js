const { Router } = require("express");
const { getLogs } = require("../controllers/log");
const { pagination } = require("../middlewares/pagination");
// const { getLogs, pagination } = require("../internal");

const router = Router();

router.get("/", getLogs, pagination);

module.exports = { logRouter: router };
