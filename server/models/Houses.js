const mongoose = require("mongoose");

const HouseSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, default: null, index: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
  },
);

module.exports = mongoose.model("Houses", HouseSchema);
