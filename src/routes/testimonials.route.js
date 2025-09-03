const express= require("express");
const router= express.Router();
const upload = require("../utils/multer");

const {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
} = require("../controllers/testimonials.controller");

// Create new testimonial (with image)
router.post("/", upload.single("image"), createTestimonial);

// Get all testimonials
router.get("/", getAllTestimonials);

// Get single testimonial by ID
router.get("/:id", getTestimonialById); 

// Update testimonial (optional new image)  
router.patch("/:id", upload.single("image"), updateTestimonial);

// Delete testimonial
router.delete("/:id", deleteTestimonial);

module.exports = router;