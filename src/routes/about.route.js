const express = require("express");
const router = express.Router();
const {
  createOrUpdateAbout,
  getAbout,
  deleteAbout
} = require("../controllers/about.controller");

// Create or Update About
router.post("/", createOrUpdateAbout);

// Get About
router.get("/", getAbout);

// Delete About
router.delete("/", deleteAbout);

module.exports = router;
