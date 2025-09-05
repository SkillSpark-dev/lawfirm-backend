const Navbar = require("../models/navbar.model");
const cloudinary = require("cloudinary").v2;
const Joi = require("joi");

//validation schema - no image validation
const navbarSchema = Joi.object({
    logo: Joi.string().trim().required(),
    firmName: Joi.string().trim().required(),
    navItems: Joi.array().items(
        Joi.object({
            label: Joi.string().trim().required(),
            href: Joi.string().trim().required(),
        })
    ).required(),
    contact: Joi.object({
        email: Joi.string().trim().required(),
        phone: Joi.string().trim().required(),
    }).required(),
});

const getNavbar = async (req, res, next) => {
    try{
        const navbar  = await Navbar.find();
        res.status(200).json({data: navbar});

    }catch(err){
        next(err);
        res.status(500).json({error: err.message});

    }
};

const updateNavbar = async (req, res, next) => {
    try{
        const { error, value } = navbarSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Validation failed", details: error.details });
        }
        const navbar = await Navbar.findOneAndUpdate({}, value, { new: true });
        res.status(200).json({ message: "Navbar updated successfully", data: navbar });
    }catch(err){
        next(err);
        res.status(500).json({error: err.message});
    }
};  


module.exports = {
    getNavbar,
    updateNavbar,
};