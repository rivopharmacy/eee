const mongoose = require("mongoose");
const { IUser } = require("./user");

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      cast: "Invalid name type",
    },
    admin: {
      type: Boolean,
      cast: "Invalid admin type",
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const permissionModel = mongoose.model("permissions", permissionSchema);

module.exports = { permissionModel };
