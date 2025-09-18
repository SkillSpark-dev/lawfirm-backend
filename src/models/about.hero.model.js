  const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
  
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      image: {
        public_id: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    

    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],

   
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);
module.exports = About;
