const mongoose = require("mongoose");
const homeSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        trim: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
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
      memberCount:{
        type: Number,
        default: 0
      },
      createdAt:{
        type: Date,
        default: Date.now
      }
},{timestamps: true});
const Home = mongoose.model("Home", homeSchema);
module.exports = Home;