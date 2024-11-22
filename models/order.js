const mongoose = require("mongoose");
const { productModel } = require("./product");
const { stockModel } = require("./stock");
const { offerModel } = require("./offer"); // Assuming an offer model exists
const { HttpError } = require("../utils/http_error");

const Status = {
  Pending: "pending",
  Shipped: "shipped",
  Delivered: "delivered",
  Returned: "returned",
  Cancelled: "cancelled",
};

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    cast: "userId is Invalid",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        cast: "product type is Invalid",
      },
    },
  ],
  offers: [
    {
      offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "offers",
        cast: "offer type is Invalid",
      },
    },
  ],
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addresses",
    cast: "Invalid address type",
  },
  subTotal: {
    type: Number,
    cast: "subTotal type is incorrect",
  },
  shippingCost: {
    type: Number,
    cast: "shippingCost type is incorrect",
  },
  tax: {
    type: Number,
    cast: "tax type is incorrect",
  },
  total: {
    type: Number,
    cast: "total type is incorrect",
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.Pending,
    cast: "status type is incorrect",
  },
  date: { type: Date, default: Date.now },
});

// Pre-save hook to check product availability and offer validity
orderSchema.pre("save", async function (next) {
  const products = this.products;
  const offers = this.offers;

  if (offers.length > 0) {
    const offerChecks = await Promise.all(
      offers.map(async (offer) => {
        const offerDoc = await offerModel.findById(offer.offer);
        if (!offerDoc) {
          throw new HttpError("Offer not found", "not-found", 404);
        }
        if (offerDoc.quantity < 1) {
          throw new HttpError("Offer expired", "not-found", 404);
        }
      })
    );
  } if (products.length > 0) {
    const availabilityChecks = await Promise.all(
      products.map(async (product) => {
        const customProduct = await productModel.findById(product.product);
        if (!customProduct) {
          throw new HttpError("Product not found", "not-found", 404);
        }

        if (customProduct.quantity < 1) {
          throw new HttpError("Product not exist", "not-found", 404);
        }
      })
    );

  }

  next();
});


orderSchema.post("save", async function (doc, next) {
  try {
    // Handle products
    if (doc.products && doc.products.length > 0) {
      await Promise.all(
        doc.products.map(async (product) => {
          const customProduct = await productModel.findById(product.product);
          if (!customProduct) {
            throw new HttpError("Product not found", "not-found", 404);
          }

          if (customProduct.quantity > 0) {
            // Decrease the product quantity
            customProduct.quantity -= 1;
            await customProduct.save();
          } else {
            throw new HttpError(
              `Not enough quantity for product ${product.product}`,
              "insufficient-stock",
              404
            );
          }
        })
      );
    }

    // Handle offers
    if (doc.offers && doc.offers.length > 0) {
      await Promise.all(
        doc.offers.map(async (offer) => {
          const offerDoc = await offerModel.findById(offer.offer);
          if (!offerDoc) {
            throw new HttpError("Offer not found", "not-found", 404);
          }
          if (offerDoc.quantity > 0) {
            offerDoc.quantity -= 1; // Decrease offer quantity by 1
            await offerDoc.save();
          } else {
            throw new HttpError("Offer expired", "offer-expired", 404);
          }
        })
      );
    }

    next();
  } catch (err) {
    next(err); // Pass any error to the next middleware
  }
});



const orderModel = mongoose.model("orders", orderSchema);

module.exports = { orderModel, orderStatus: Status };
