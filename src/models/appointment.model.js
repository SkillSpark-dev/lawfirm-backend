const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    phone:{
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: String,
        required: true,
        trim: true
    },
    time:{
        type: String,
        required: true,
        trim: true
    },
    
    
})


const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment