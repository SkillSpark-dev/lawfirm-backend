const expres = require("express");
const router = expres.Router();

const {
   getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");
const isAuthenticated = require("../middlewares/authentication");
const upload = require("../utils/multer");

router.post("/", isAuthenticated, upload.single("image"), createTestimonial);
router.get("/", getTestimonials);

router.patch("/:id", isAuthenticated, upload.single("image"), updateTestimonial);
router.delete("/:id", isAuthenticated, deleteTestimonial);

module.exports = router;