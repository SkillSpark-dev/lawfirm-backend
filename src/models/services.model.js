const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  serviceCardTitle: {
    type: String,
    trim: true,
    default: ''
  },
  serviceCardDescription: {
    type: String,
    trim: true,
    default: ''
  },
  serviceCardFeatures: {
    type: [String], // array of strings
    default: []
  }
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
