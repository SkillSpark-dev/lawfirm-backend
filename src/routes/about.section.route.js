const express = require("express");
const router = express.Router();
const {
  getAboutHero,
  createOrUpdateAboutHero,
  deleteAboutHero,
} = require("../controllers/about.section.controller");
const isAuthenticated = require("../middlewares/authentication");
const { upload } = require("../utils/multer"); // destructured

// Public route
router.get("/", getAboutHero);

// Admin routes
router.post("/", isAuthenticated, upload.single("image"), createOrUpdateAboutHero);
router.delete("/:id", isAuthenticated, deleteAboutHero);

module.exports = router;
