const About = require("../models/about.hero.model");
const cloudinary = require("../utils/cloudinary");

// @access  Public
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne().sort({ createdAt: -1 });
    if (!about) {
      return res.status(404).json({ success: false, message: "About data not found" });
    }
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @access  Admin
const createAbout = async (req, res) => {
  try {
  

    const imageFile = req.files?.image?.[0];
    const image = imageFile
      ? { public_id: imageFile.filename, url: imageFile.path }
      : { public_id: "", url: "" };

    const about = await About.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      image,
      stats: req.body.stats ? JSON.parse(req.body.stats) : [],
    });

    res.status(201).json({ success: true, data: about });
  } catch (error) {
    console.error("Create About Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @access  Admin
const updateAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ success: false, message: "About not found" });

    // Update image if uploaded
    if (req.files?.image) {
      if (about.image.public_id) {
        await cloudinary.uploader.destroy(about.image.public_id);
      }
      const file = req.files.image[0];
      about.image = { public_id: file.filename, url: file.path };
    }

    about.title = req.body.title || about.title;
    about.subtitle = req.body.subtitle || about.subtitle;

    // Convert stats object to array if needed
    if (req.body.stats) {
      // req.body.stats may come as {0: {...}, 1: {...}} due to FormData
      about.stats = Array.isArray(req.body.stats)
        ? req.body.stats
        : Object.values(req.body.stats);
    }

    await about.save();
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @access  Admin
const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ success: false, message: "About not found" });

    if (about.image.public_id) {
      await cloudinary.uploader.destroy(about.image.public_id);
    }

    await about.remove();
    res.status(200).json({ success: true, message: "About deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
module.exports = { getAbout, createAbout, updateAbout, deleteAbout };