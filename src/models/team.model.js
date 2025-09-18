const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    default: ""
  },
  image: {
    public_id: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    }
  },
  socialLinks: {
   linkedin: {
  type: String,
  trim: true,
  default: "",
  match: /^https?:\/\/.+/  // ensures valid URL
},
facebook: {
  type: String,
  trim: true,
  default: "",
  match: /^https?:\/\/.+/
}

    ,
   
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
