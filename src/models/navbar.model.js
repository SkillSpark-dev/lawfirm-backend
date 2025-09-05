const mongoose = require("mongoose");
const navbarSchema = new mongoose.Schema({
    logo:{
        type: String,
        required: true,
        
    },
    firmName: {
        type: String,
        required: true,

    },
    navItems: [
        {
            label: {
                type: String,
                required: true,
            },
            href: {
                type: String,
                required: true,
            },
        }

    ],
    contact : {
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        
    }
},{timestamps: true});

const Navbar = mongoose.model("Navbar", navbarSchema);
module.exports = Navbar;