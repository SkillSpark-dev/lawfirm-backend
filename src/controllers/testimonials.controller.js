const Testimonial = require("../models/testimonial.model");
const cloudinary = require("cloudinary").v2;
const Joi = require("joi");

// Validation Schemas
const testimonialsSchema = Joi.object({
  name: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
  position: Joi.string().trim().required(),
});

const testimonialsUpdateSchema = Joi.object({
  name: Joi.string().trim().optional(),
  message: Joi.string().trim().optional(),
  position: Joi.string().trim().optional(),
});

// CREATE
const createTestimonial = async (req, res, next) => {
  try {
    const { error, value } = testimonialsSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation failed", details: error.details });
    }

    const imageData = req.file
      ? { public_id: req.file.filename, url: req.file.path }
      : { public_id: "", url: "" };

    const newTestimonial = new Testimonial({ ...value, image: imageData });
    await newTestimonial.save();

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
    res.status(200).json({ data: testimonials });
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

    const { error, value } = testimonialsUpdateSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation failed", details: error.details });
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
      value.image = { public_id: req.file.filename, url: req.file.path };
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, value, {
      new: true,
    });

    res.status(200).json({
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
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
