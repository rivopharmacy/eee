const cleanUpdates = (params) => (req, res, next) => {
    req.body = Object.fromEntries(
      Object.entries(req.body).filter((key) => !params.includes(key[0]))
    );
    next();
  };
  
  module.exports = { cleanUpdates };
  