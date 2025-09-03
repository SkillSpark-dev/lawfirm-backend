const Service = require("../models/services.model");
const cloudinary = require("cloudinary").v2;

// Helper: parse serviceCardFeatures safely
function parseFeatures(features) {
  if (!features) return [];
  if (Array.isArray(features)) return features; // already array (form-data multiple keys)
  try {
    // Try parsing as JSON
    return JSON.parse(features);
  } catch {
    // Fallback: split comma-separated string
    return features.split(",").map(f => f.trim()).filter(Boolean);
  }
}

// CREATE a new service
const createService = async (req, res, next) => {
  try {
    const {
      category,
      description,
      serviceCardTitle,
      serviceCardDescription
    } = req.body;

    const serviceCardFeatures = parseFeatures(req.body.serviceCardFeatures);

    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploaded = await cloudinary.uploader.upload(image.path);

    const newService = await Service.create({
      category,
      description,
      serviceCardTitle,
      serviceCardDescription,
      serviceCardFeatures,
      image: {
        public_id: uploaded.public_id,
        url: uploaded.secure_url
      }
    });

    res.status(201).json({ message: "Service created", data: newService });
  } catch (error) {
    next(error);
  }
};

// GET all services
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ data: services });
  } catch (error) {
    next(error);
  }
};

// GET a single service by ID
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ data: service });
  } catch (error) {
    next(error);
  }
};

// UPDATE service
const updateService = async (req, res, next) => {
  try {
    const {
      category,
      description,
      serviceCardTitle,
      serviceCardDescription
    } = req.body;

    const serviceCardFeatures = req.body.serviceCardFeatures
      ? parseFeatures(req.body.serviceCardFeatures)
      : undefined;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const image = req.file;
    if (image) {
      if (service.image?.public_id) {
        await cloudinary.uploader.destroy(service.image.public_id);
      }
      const uploaded = await cloudinary.uploader.upload(image.path);
      service.image = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url
      };
    }

    service.category = category || service.category;
    service.description = description || service.description;
    service.serviceCardTitle = serviceCardTitle || service.serviceCardTitle;
    service.serviceCardDescription = serviceCardDescription || service.serviceCardDescription;
    if (serviceCardFeatures !== undefined) {
      service.serviceCardFeatures = serviceCardFeatures;
    }

    await service.save();
    res.status(200).json({ message: "Service updated", data: service });
  } catch (error) {
    next(error);
  }
};

// DELETE service
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(service.image.public_id);
    }

    await service.deleteOne();
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};
