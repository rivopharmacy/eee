const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        cast: 'Invalid userId',
        ref: 'users',
    },
    title: {
        type: String,
        cast: 'title type must be a string',
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        cast: 'product type is Invalid',
    }],
});

const wishModel = mongoose.model("wishes", wishSchema);

module.exports = { wishModel };
