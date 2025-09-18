const Testimonial = require("../models/testimonial.model");
const cloudinary = require("../utils/cloudinary");

// @desc    Get all testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new testimonial
// @access  Admin
const createTestimonial = async (req, res) => {
  try {
    let clientImage = { public_id: "", url: "" };

    if (req.file) {
      clientImage = {
        public_id: req.file.filename,
        url: req.file.path, // CloudinaryStorage already gives you secure URL in `path`
      };
    }

    const testimonial = await Testimonial.create({
      clientName: req.body.clientName,
      clientProfession: req.body.clientProfession,
      feedback: req.body.feedback,
      clientImage,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a testimonial
// @access  Admin
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });

    // Update image if a new one is uploaded
    if (req.file) {
      if (testimonial.clientImage?.public_id) {
        await cloudinary.uploader.destroy(testimonial.clientImage.public_id);
      }
      testimonial.clientImage = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    testimonial.clientName = req.body.clientName || testimonial.clientName;
    testimonial.clientProfession = req.body.clientProfession || testimonial.clientProfession;
    testimonial.feedback = req.body.feedback || testimonial.feedback;

    await testimonial.save();
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a testimonial
// @access  Admin
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });

    if (testimonial.clientImage?.public_id) {
      await cloudinary.uploader.destroy(testimonial.clientImage.public_id);
    }

    await testimonial.deleteOne();
    res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
