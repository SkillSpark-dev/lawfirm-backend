const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  createOrUpdateHome,
  getHome,
  updateHome,
  deleteHome
} = require("../controllers/home.controller");

// Multer config for multiple fields
const uploadFields = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "serviceImages", maxCount: 10 },
  { name: "testimonialImages", maxCount: 10 }
]);

// Create or Replace Home
router.post("/", uploadFields, createOrUpdateHome);

// Get first Home entry
router.get("/", getHome);

// Update Home by ID
router.patch("/:id", uploadFields, updateHome);

// Delete Home by ID
router.delete("/:id", deleteHome);

module.exports = router;
