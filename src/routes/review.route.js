const express = require("express");
const router = express.Router();

const {
  createInfo,
  getAllInfo,
  getInfoById,
  updateInfo,
  deleteInfo
} = require("../controllers/info.controller");

// Create new info
router.post("/", createInfo);

// Get all info entries
router.get("/", getAllInfo);

// Get single info by ID
router.get("/:id", getInfoById);

// Update info by ID
router.put("/:id", updateInfo);

// Delete info by ID
router.delete("/:id", deleteInfo);

module.exports = router;
