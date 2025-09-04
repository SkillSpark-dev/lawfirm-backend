const Testimonial = require("../models/testimonial.model");
const cloudinary = require("cloudinary").v2;
const Joi = require("joi");

// ------------------- VALIDATION SCHEMAS -------------------
const testimonialSchema = Joi.object({
  name: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
  position: Joi.string().trim().required(),
  image: Joi.object({
    public_id: Joi.string().allow("").optional(),
    url: Joi.string().allow("").optional(),
  }).optional(),
});

const testimonialUpdateSchema = Joi.object({
  name: Joi.string().trim().optional(),
  message: Joi.string().trim().optional(),
  position: Joi.string().trim().optional(),
  image: Joi.object({
    public_id: Joi.string().allow("").optional(),
    url: Joi.string().allow("").optional(),
  }).optional(),
}).min(1); // ensure at least one field is updated

// ------------------- CONTROLLERS -------------------

// CREATE
const createTestimonial = async (req, res, next) => {
  try {
    const { error, value } = testimonialSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details,
      });
    }

    let imageData = { public_id: "", url: "" };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "testimonials",
      });
      imageData = { public_id: result.public_id, url: result.secure_url };
    }

    const newTestimonial = await Testimonial.create({
      ...value,
      image: imageData,
    });

    res.status(201).json({
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (err) {
    next(err);
  }
};

// READ ALL
const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: testimonials.length,
      data: testimonials,
    });
  } catch (err) {
    next(err);
  }
};

// READ ONE
const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json({ data: testimonial });
  } catch (err) {
    next(err);
  }
};

// UPDATE
const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error, value } = testimonialUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details,
      });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Handle new image upload
    if (req.file) {
      if (testimonial.image?.public_id) {
        await cloudinary.uploader.destroy(testimonial.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "testimonials",
      });
      value.image = { public_id: result.public_id, url: result.secure_url };
    }

    Object.assign(testimonial, value);
    await testimonial.save();

    res.status(200).json({
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    if (testimonial.image?.public_id) {
      await cloudinary.uploader.destroy(testimonial.image.public_id);
    }

    await testimonial.deleteOne();
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
