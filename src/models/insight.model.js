
const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
  all: {
    type: String,
    required: true,
    trim: true
  },
  companyRegistrationAndCompliance: {
    type: String,
    required: true,
    trim: true
  },
  foreignInvestment: {
    type: String,
    required: true,
    trim: true
    },
  
  law: {
    type: String,
    trim: true,
    default: "general"
  },
 
}, { timestamps: true });

const Insight = mongoose.model("Insight", insightSchema);

module.exports = Insight;
