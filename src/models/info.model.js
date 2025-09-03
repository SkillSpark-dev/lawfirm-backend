const mongoose = require("mongoose");
const infoSchema = new mongoose.Schema({
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
    address:{
        type: String,
        required: true,
        trim: true
    },
    links:{
        facebook:{
            type: String,
            trim: true,
            default: ""
        },
        linkedIn:{
            type: String,
            trim: true,
            default: ""
        },

    }
},{timestamps:true});
const Info = mongoose.model("Info",infoSchema);
module.exports = Info;