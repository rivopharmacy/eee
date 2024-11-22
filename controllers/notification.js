// const {  notificationModel, userModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async")

const admin = require("firebase-admin");
const mongoose = require("mongoose");
const { notificationModel } = require("../models/notification");
const { userModel } = require("../models/user");

const getNotification = asyncHandler(
  async (req, res, next) => {
    req.model = notificationModel;
    req.modelName = 'notifications';
    next();
  }
);

const createNotification = asyncHandler(
  async (req, res, next) => {
    req.model = notificationModel;
    req.modelName = 'notifications';
    next();
  }
);

const sendPushNotification = async (title, body, notifyUser, data) => {
  const user = await userModel.findById(notifyUser).select('+fcmTokens');
  const fcmTokens = user?.fcmTokens;
  
  if(fcmTokens && fcmTokens.length > 0){
    const response = await admin.messaging().sendMulticast({
      data: {
        title: title ?? "Test Title",
        body: body ?? "Test Body",
      },
      notification: {
        title: title ?? "Test Title",
        body: body.toString() ?? "Test Body",
      },
      android: { priority: "high" },
      apns: { payload: { aps: { contentAvailable: true } } },
      tokens: fcmTokens,
    });
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(fcmTokens[idx]);
        }
      });
      await userModel.updateOne(
        { _id: notifyUser },
        { $pullAll: { fcmTokens: failedTokens } }
      );
    }
  }
};

const updateNotification = asyncHandler(
  async (req, res, next) => {
    req.model = notificationModel;
    req.modelName = 'notifications';
    next();
  }
);

const deleteNotification = asyncHandler(
  async (req, res, next) => {
    req.model = notificationModel;
    req.modelName = 'notifications';
    next();
  }
);





const sendPushNotificationToAll = async (title, body, data) => {
  // Retrieve all users' FCM tokens
  const users = await userModel.find({}).select('+fcmTokens');
  const allFcmTokens = users.reduce((tokens, user) => {
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      tokens.push(...user.fcmTokens);
    }
    return tokens;
  }, []);

  // Ensure there are tokens to send notifications
  if (allFcmTokens.length > 0) {
    const response = await admin.messaging().sendMulticast({
      data: {
        ...data, // Add any custom data if needed
        title: title ?? "Default Title",
        body: body ?? "Default Body",
      },
      notification: {
        title: title ?? "Default Title",
        body: body ?? "Default Body",
      },
      android: { priority: "high" },
      apns: { payload: { aps: { contentAvailable: true } } },
      tokens: allFcmTokens,
    });

    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(allFcmTokens[idx]);
        }
      });

      // Remove failed tokens from database
      await userModel.updateMany(
        { fcmTokens: { $in: failedTokens } },
        { $pullAll: { fcmTokens: failedTokens } }
      );
    }

    return { success: response.successCount, failed: response.failureCount };
  } else {
    throw new Error("No FCM tokens found.");
  }
};


module.exports = {
  getNotification,
  createNotification,
  sendPushNotification,
  updateNotification,
  deleteNotification,
  sendPushNotificationToAll
};



