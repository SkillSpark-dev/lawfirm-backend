const { raw } = require("express");
const mongoose = require("mongoose");

const  reviewSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
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
          rating: {
            type: Number,
            default: 5
          },
        createdAt: {
            type: Date,
            default: Date.now
        }
},{timestamps: true});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;