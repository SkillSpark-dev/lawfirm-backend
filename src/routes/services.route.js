
// routes/service.routes.js
const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} = require("../controllers/services.conntroller");

const upload = require("../utils/multer");

// Create Service
router.post("/", upload.single("image"), createService);

// Get All
router.get("/", getAllServices);

// Get One
router.get("/:id", getServiceById);

// Update
router.patch("/:id", upload.single("image"), updateService);

// Delete
router.delete("/:id", deleteService);

module.exports = router;
