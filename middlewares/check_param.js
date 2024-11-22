// const { HttpError } = require("../internal");

const { HttpError } = require("../utils/http_error");

const checkNecessaryParameters = (parameters) => (req, res, next) => {
  let params = [];
  let flag = true;
  for (let i = 0; i < parameters.length; i++) {
    if (req.body[parameters[i]] == null) {
      params.push(parameters[i]);
      flag = false;
    }
  }
  if (flag) {
    return next();
  } else {
    next(HttpError.missingParameters(params.join(",")));
  }
};

module.exports = { checkNecessaryParameters };
