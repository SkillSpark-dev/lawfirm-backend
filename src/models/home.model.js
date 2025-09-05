const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema({
  heroSection: {
    headline: String,
    subHeadline: String,
    tagline: String,
    ctaText: String,
    ctaLink: String,
    bannerImage: String
  },
  services: [
    {
      title: String,
      description: String,
      icon: String,
      image: String
    }
  ],
  testimonials: [
    {
      clientName: String,
      feedback: String,
      clientImage: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("HomePage", homePageSchema);
