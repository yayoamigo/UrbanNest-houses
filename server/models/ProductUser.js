const mongoose = require("mongoose");

const ProductUserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  product_id: { type: Number, required: true },
});

// Creating a unique compound index for user_id and product_id
ProductUserSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("ProductUser", ProductUserSchema);
