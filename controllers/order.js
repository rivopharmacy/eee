// const {  createLogs, orderModel, sendPushNotification, userModel } = require("../internal");
const {asyncHandler} = require("../middlewares/async");
const { orderModel } = require("../models/order");
const { productModel } = require("../models/product");
const { userModel } = require("../models/user");
const { createLogs } = require("./log");
const { sendPushNotification } = require("./notification");


const getOrders = asyncHandler(async (req, res, next) => {
  req.model = orderModel;
  req.modelName = "orders";
  const user = await userModel.findOne({
    _id: req.user._id,
    isAdmin: false,
  });
  if (user) {
    req.query.userId = req.user._id;
  }
  if (req.query.streetAddress) {
    const address = req.query.streetAddress;
    delete req.query["streetAddress"];
    req.query.streetAddress = { $regex: address, $options: "i" };
  }
  req.populate = "userId products.product address offers.offer";
  next();
});

const getOrderById = asyncHandler(async (req, res, next) => {
  req.model = orderModel;
  req.modelName = "orders";
  const user = await userModel.findOne({
    _id: req.user._id,
    isAdmin: false,
  });
  if (user) {
    req.query.userId = req.user._id;
  }
  req.populate = "userId products.product address offers.offer";
  next();
});

const createOrder = asyncHandler(async (req, res, next) => {
  req.body.userId = req.session.user;
  req.body.date = Date.now();
  req.body.products  = req.body.products &&  req.body.products?.map((ele) => {
    return { product: ele };  
  });
  req.body.offers =req.body.offers && req.body.offers?.map((ele) => {
    return { offer: ele };  
  });
  const result = await orderModel.create(req.body);
  if (result) {
    createLogs(req.session.user, "orders", "ADD", result._id, result.toJSON());
    sendPushNotification(
      "Your order is placed successfully!",
      `Keep in touch with us via our chat support or email, Thank you!`,
      req.session.user,
      null
    );
    res.json({ success: true, result });
  }
});

const updateOrder = asyncHandler(
  async (req, res, next) => {
    req.model = orderModel;
    req.modelName = "orders";
    next();
  }
);

const deleteOrder = asyncHandler(
  async (req, res, next) => {
    req.model = orderModel;
    req.modelName = "orders";
    next();
  }
);

const getOrdersSales = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    _id: req.user._id,
    isAdmin: true,
  });
  if (user) {
    req.query.userId = req.user._id;
  }

  const deliveredOrders = await orderModel
    .find({ status: "delivered" })
    .select("total");

  const result = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

  res.json({ success: true, result });
});

const getOrdersCost = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    _id: req.user._id,
    isAdmin: true,
  });
  if (user) {
    req.query.userId = req.user._id;
  }

  const deliveredOrders = await orderModel
    .find({ status: "delivered" })
    .select("shippingCost tax");

  const result = deliveredOrders.reduce(
    (sum, order) => sum + order.shippingCost + order.tax,
    0
  );

  res.json({ success: true, result });
});

const getOrdersProfit = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    _id: req.user._id,
    isAdmin: true,
  });
  if (user) {
    req.query.userId = req.user._id;
  }

  const deliveredOrders = await orderModel
    .find({ status: "delivered" })
    .select("subTotal");

  const result = deliveredOrders.reduce(
    (sum, order) => sum + order.subTotal,
    0
  );

  res.json({ success: true, result });
});

const getOrderSummary = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    _id: req.user._id,
    isAdmin: true,
  });
  if (user) {
    req.query.userId = req.user._id;
  }

  const deliveredOrders = await orderModel
    .find({ status: "delivered" })
    .select("total date");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let last7months = [];

  for (let index = 0; index < 7; index++) {
    let newIndex = currentMonth - index;

    if (newIndex >= 0)
      last7months.push({
        value: 0,
        year: currentYear,
        month: Months[newIndex],
      });
    else
      last7months.push({
        value: 0,
        year: currentYear - 1,
        month: Months[Months.length + newIndex],
      });
  }

  deliveredOrders.forEach((order) => {
    const orderMonth = new Date(order.date).getMonth();
    const orderYear = new Date(order.date).getFullYear();

    last7months.forEach((summary) => {
      if (summary.month === Months[orderMonth] && summary.year === orderYear) {
        summary.value += order.total;
      }
    });
  });

  res.json({ success: true, result: last7months });
});

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderSummary,
  getOrdersSales,
  getOrdersCost,
  getOrdersProfit,
};
