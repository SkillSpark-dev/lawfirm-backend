const Home = require("../models/home.model");
const cloudinary = require("cloudinary").v2;

// Create or Replace Home
const createOrUpdateHome = async (req, res, next) => {
  try {
    const { caption, title, description, memberCount } = req.body;

    // Check if there's already a home entry
    const existingHome = await Home.findOne();
    if (existingHome) {
      // Delete old Cloudinary image
      if (existingHome.image?.public_id) {
        await cloudinary.uploader.destroy(existingHome.image.public_id);
      }
      await existingHome.deleteOne();
    }

    // If a file is uploaded
    const imageData = req.file
      ? { public_id: req.file.filename, url: req.file.path }
      : { public_id: "", url: "" };

    const newHome = new Home({
      caption,
      title,
      description,
      image: imageData,
      memberCount
    });

    await newHome.save();
    res.status(201).json({ message: "Home created/updated successfully", data: newHome });
  } catch (error) {
    next(error);
  }
};

// Get first home record
const getHome = async (req, res, next) => {
  try {
    const home = await Home.findOne();
    if (!home) return res.status(404).json({ message: "Home not found" });
    res.status(200).json({ data: home });
  } catch (error) {
    next(error);
  }
};

// Get home by ID
const getHomeById = async (req, res, next) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });
    res.status(200).json({ data: home });
  } catch (error) {
    next(error);
  }
};

// Update home by ID
const updateHome = async (req, res, next) => {
  try {
    const { caption, title, description, memberCount } = req.body;
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });

    // If new image is uploaded
    if (req.file) {
      if (home.image?.public_id) {
        await cloudinary.uploader.destroy(home.image.public_id);
      }
      home.image = { public_id: req.file.filename, url: req.file.path };
    }

    home.caption = caption;
    home.title = title;
    home.description = description;
    home.memberCount = memberCount;

    await home.save();
    res.status(200).json({ message: "Home updated successfully", data: home });
  } catch (error) {
    next(error);
  }
};

// Delete home by ID
const deleteHome = async (req, res, next) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });

    if (home.image?.public_id) {
      await cloudinary.uploader.destroy(home.image.public_id);
    }

    await home.deleteOne();
    res.status(200).json({ message: "Home deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateHome,
  getHome,
  getHomeById,
  updateHome,
  deleteHome
};
