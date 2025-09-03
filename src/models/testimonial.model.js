const mongoose = require("mongoose");
const testimonialSchema = new mongoose.Schema({
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
    position: {
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
})