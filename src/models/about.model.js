const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  
client:{
    type:Number
},
successCase:{
    type:Number
},
professionalLawyer:{
    type: Number
}

 
}, { timestamps: true });

const About = mongoose.model("About", aboutSchema);
module.exports = About;
