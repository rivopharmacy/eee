// const {  userModel } = require("../internal");
const { cardModel } = require("../models/card");
const { Stripe } = require("stripe");
const {asyncHandler} = require("../middlewares/async");
const { userModel } = require("../models/user");

const stripe = new Stripe('sk_test_51OnlVODprsdU1lbtRhqWFznwXM3xpd6dNPc4hNzMZ3CakK70hZG2pRjfTn9Wk1XK082KNJWp1gajj80LWQAvGO3g00rMRoLXuv');

const addPayment = asyncHandler(
  async (req, res, next) => {
    req.body.userId = req.user._id;
    const { currency, amount, address } = req.body;
    const user = await userModel.findById(req.user._id);
    await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: currency,
      receipt_email: user?.email,
      shipping: {
        name: user?.firstName + ' ' + user?.lastName,
        address: {
          line1: address.streetAddress,
          postal_code: address.zipCode,
          city: address.city,
          state: address.state,
          country: address.country,
        },
      },
    })
    .then((paymentIntent) => {
      res.send({ success: true, client_secret: paymentIntent.client_secret });
    })
    .catch((error) => {
      res.send("Something went wrong");
    });
  }
);

const addCard = asyncHandler(
  async (req, res, next) => {
    req.model = cardModel;
    req.modelName = 'cards';
    req.body.userId = req.user._id;
    next();
  }
);

const getCards = asyncHandler(
  async (req, res, next) => {
    req.model = cardModel;
    req.modelName = 'cards';
    req.query = {
      'userId': req.user._id
    };
    next();
  }
);

module.exports = { 
  addPayment, 
  addCard, 
  getCards,
};
