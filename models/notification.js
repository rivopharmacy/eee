const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    cast: "title type must be of string"
  },
  description: {
    type: String,
    cast: "description type must be of string"
  },
  date: {
    type: Date,
    cast: "Date type must be of Date"
  },
});

const notificationModel = mongoose.model('notifications', notificationSchema);

module.exports = { notificationModel };
