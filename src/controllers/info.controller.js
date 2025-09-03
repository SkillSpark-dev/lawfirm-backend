const Joi = require('joi');
const Info = require("../models/info.model");

// Validation schema
const infoSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  links: Joi.object({
    facebook: Joi.string().allow("").optional(),
    linkedIn: Joi.string().allow("").optional()
  }).optional()
});

// Create info
const createInfo = async (req, res, next) => {
  try {
    const { error, value } = infoSchema.validate(req.body, {
      allowUnknown: true,
      stripUnknown: true,
      abortEarly: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const newInfo = new Info(value);
    await newInfo.save();
    res.status(201).json({ message: "Info created successfully", data: newInfo });
  } catch (err) {
    next(err);
  }
};

// Get all info entries
const getAllInfo = async (req, res, next) => {
  try {
    const infos = await Info.find();
    res.status(200).json({ data: infos });
  } catch (err) {
    next(err);
  }
};

// Get single info by ID
const getInfoById = async (req, res, next) => {
  try {
    const info = await Info.findById(req.params.id);
    if (!info) {
      return res.status(404).json({ message: "Info not found" });
    }
    res.status(200).json({ data: info });
  } catch (err) {
    next(err);
  }
};

// Update info by ID
const updateInfo = async (req, res, next) => {
  try {
    const { error, value } = infoSchema.validate(req.body, {
      allowUnknown: true,
      stripUnknown: true,
      abortEarly: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const info = await Info.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!info) {
      return res.status(404).json({ message: "Info not found" });
    }

    res.status(200).json({ message: "Info updated successfully", data: info });
  } catch (err) {
    next(err);
  }
};

// Delete info by ID
const deleteInfo = async (req, res, next) => {
  try {
    const info = await Info.findByIdAndDelete(req.params.id);
    if (!info) {
      return res.status(404).json({ message: "Info not found" });
    }
    res.status(200).json({ message: "Info deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInfo,
  getAllInfo,
  getInfoById,
  updateInfo,
  deleteInfo
};
