const Service = require("../models/services.model");
const cloudinary = require("cloudinary").v2;

/**
 * Utility: Parse features (string, JSON, or array) safely
 */
function parseFeatures(featuresInput) {
  if (!featuresInput) return [];
  if (Array.isArray(featuresInput)) return featuresInput;
  if (typeof featuresInput === "string") {
    try {
      return JSON.parse(featuresInput);
    } catch {
      return featuresInput.split(",").map((f) => f.trim());
    }
  }
  return [];
}

/**
 * Utility: Parse details (stringified JSON or array)
 */
function parseDetails(detailsInput) {
  if (!detailsInput) return [];
  if (Array.isArray(detailsInput)) return detailsInput;
  if (typeof detailsInput === "string") {
    try {
      return JSON.parse(detailsInput);
    } catch (e) {
      console.warn("⚠️ Could not parse details, received string:", detailsInput);
      return [];
    }
  }
  return [];
}

/**
 * CREATE Service
 */
const createService = async (req, res) => {
  try {
    const {
      category,
      description,
      serviceCardTitle,
      serviceCardDescription,
      serviceCardFeatures,
      details,
    } = req.body;

    const features = parseFeatures(serviceCardFeatures);
    const parsedDetails = parseDetails(details);

    let image = { public_id: "", url: "" };
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "services",
      });
      image = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    const newService = await Service.create({
      category,
      description,
      serviceCardTitle,
      serviceCardDescription,
      serviceCardFeatures: features,
      details: parsedDetails,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (err) {
    console.error("❌ Error creating service:", err);
    res.status(500).json({
      success: false,
      message: "Service creation failed",
      error: err.message,
    });
  }
};

/**
 * UPDATE Service
 */
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    service.category = req.body.category ?? service.category;
    service.description = req.body.description ?? service.description;
    service.serviceCardTitle =
      req.body.serviceCardTitle ?? service.serviceCardTitle;
    service.serviceCardDescription =
      req.body.serviceCardDescription ?? service.serviceCardDescription;

    if (req.body.serviceCardFeatures) {
      service.serviceCardFeatures = parseFeatures(req.body.serviceCardFeatures);
    }

    if (req.body.details) {
      service.details = parseDetails(req.body.details);
    }

    if (req.file) {
      if (service.image?.public_id) {
        await cloudinary.uploader.destroy(service.image.public_id);
      }
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "services",
      });
      service.image = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    const updated = await service.save();

    res.json({
      success: true,
      message: "Service updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updating service:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


/**
 * GET All Services
 */
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    const normalizedServices = services.map((s) => ({
      ...s.toObject(),
      image:
        typeof s.image === "string"
          ? { public_id: null, url: s.image }
          : s.image,
    }));

    res.json({
      success: true,
      count: normalizedServices.length,
      data: normalizedServices,
    });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

/**
 * GET Single Service by ID
 */
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    console.error("Error fetching service:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


/**
 * DELETE Service
 */
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(service.image.public_id);
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
