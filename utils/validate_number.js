const { parsePhoneNumber } = require('libphonenumber-js');
const { HttpError } = require('./http_error');

const parseNumber = (contactNumber) => {
  if (contactNumber) {
    try {
      const phoneNumber = parsePhoneNumber(contactNumber);
      if (phoneNumber && phoneNumber.isPossible() && phoneNumber.isValid()) {
        return phoneNumber.number;
      }
    } catch (_) {}
    throw HttpError.invalidContactNumber();
  }
  return null;
};

module.exports = { parseNumber };
