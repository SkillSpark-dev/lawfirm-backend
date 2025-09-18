const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
    },
    buttonLink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // automatically adds createdAt, updatedAt
);

const Info = mongoose.model("Info", infoSchema);
module.exports = Info;
