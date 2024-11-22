const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const { queryParser } = require("express-query-parser");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const { createServer } = require("http");
const { createSessionStore } = require("./config/session_store.js");
const { CronJob } = require("cron");
const { authRouter } = require("./routes/auth.js");
const { userRouter } = require("./routes/user.js");
const { logRouter } = require("./routes/log.js");
const { uploadRouter } = require("./routes/upload.js");
const { permissionRouter } = require("./routes/permission.js");
const { notificationRouter } = require("./routes/notification.js");
const { productRouter } = require("./routes/product.js");
const { offerRouter } = require("./routes/offer.js");
const { orderRouter } = require("./routes/order.js");
const { paymentRouter } = require("./routes/payment.js");
const { addressRouter } = require("./routes/address.js");
const { messageRouter } = require("./routes/message.js");
const {notifyUsersRouter} = require("./routes/notifyUsers.js");
const { stockRouter } = require("./routes/stock.js");
const { errorHandler } = require("./middlewares/error.js");
const { salesAnalytics } = require("./utils/sales_analytics.js");
const { wishRouter } = require("./routes/wish.js");
const { chatsRouter } = require("./routes/chat.js");
const { chatSupport } = require("./controllers/chat_support.js");
// const {
//   addressRouter,
//   authRouter,
//   errorHandler,
//   logRouter,
//   notificationRouter,
//   orderRouter,
//   paymentRouter,
//   permissionRouter,
//   productRouter,
//   chatSupport,
//   uploadRouter,
//   userRouter,
//   wishRouter,
//   chatsRouter,
//   salesAnalytics,
//   messageRouter,
//   stockRouter,
//   offerRouter,
// } = require("./internal.js");

admin.initializeApp({
  credential: admin.credential.cert("serviceAccountKey.json"),
});

dotenv.config({ path: ".env" });

new CronJob('0 0 1 * *', salesAnalytics, null, true, 'Etc/UTC');

const app = express();
const httpServer = createServer(app);
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.enable("trust proxy");

app.use(createSessionStore());

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/logs", logRouter);
app.use("/uploads", uploadRouter);
app.use("/permissions", permissionRouter);
app.use("/notifications", notificationRouter);
app.use("/notifications-to-all", notifyUsersRouter);
app.use("/products", productRouter);
app.use("/offers", offerRouter);
app.use("/orders", orderRouter);
app.use("/wishes", wishRouter);
app.use("/payments", paymentRouter);
app.use("/addresses", addressRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messageRouter);
app.use("/stocks", stockRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"));

const io = new Server(httpServer);
chatSupport(io);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
