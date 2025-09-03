const express = require("express");
const router = express.Router();
const upload = require("../utils/multer"); // multer or cloudinary upload middleware

const {
  createOrUpdateHome,
  getHome,
  getHomeById,
  updateHome,
  deleteHome
} = require("../controllers/home.controller");

// Create or Replace Home
router.post("/", upload.single("image"), createOrUpdateHome);

// Get first Home entry
router.get("/", getHome);

// Get Home by ID
router.get("/:id", getHomeById);

// Update Home by ID
router.put("/:id", upload.single("image"), updateHome);

// Delete Home by ID
router.delete("/:id", deleteHome);

module.exports = router;
