const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    isDisable: {
      type: Boolean,
      default: false,
      cast: "isDisable datatype is incorrect",
    },
    isSocial: {
      type: Boolean,
      default: false,
      cast: "isSocial datatype is incorrect",
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addresses",
        cast: "Invalid address type",
      },
    ],
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cards",
        cast: "Invalid cards type",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
      cast: "invalid isAdmin type",
    },
    password: {
      type: String,
      select: false,
      cast: "password datatype is incorrect",
    },
    firstName: {
      type: String,
      cast: "firstName datatype is incorrect",
    },
    lastName: {
      type: String,
      cast: "lastName datatype is incorrect",
    },
    resetCode: {
      type: String,
      default: null,
      cast: "resetCode datatype is incorrect",
    },
    resetCodeExpiry: {
      type: Date,
      default: null,
      cast: "resetCodeExpiry datatype is incorrect",
    },
    verificationCode: {
      type: String,
      default: null,
      cast: "verificationCode datatype is incorrect",
    },
    verificationCodeExpiry: {
      type: Date,
      default: null,
      cast: "verificationCodeExpiry datatype is incorrect",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      cast: "image datatype is incorrect",
    },
    contactNumber: {
      type: String,
      cast: "contactNumber datatype is incorrect",
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      cast: "email datatype is incorrect",
    },
    fcmTokens: [
      {
        type: String,
        cast: "fcmTokens datatype is incorrect",
        select: false,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Middleware for password hashing
userSchema.pre("save", function (next) {
  if (this.isSocial || !this.isModified("password")) {
    next();
  } else {
    bcrypt.hash(
      this.password,
      parseInt(process.env.SALT_WORK_FACTOR),
      (err, hashedPass) => {
        if (err) {
          return next(err);
        }
        this.password = hashedPass;
        next();
      }
    );
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) {
    const user = await this.constructor.findById(this._id).select("+password");
    if (user && user.password) {
      return bcrypt.compare(password, user.password);
    }
    throw new Error("Password not found for comparison.");
  }
  return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("users", userSchema);

module.exports = { userModel };
