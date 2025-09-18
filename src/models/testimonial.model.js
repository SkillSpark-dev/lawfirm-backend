const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    feedback: {
        type: String,
        required: true,
        trim: true
    },
    clientProfession: {
        type: String,
        required: true,
        trim: true
    },
    clientImage: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;