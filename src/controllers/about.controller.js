const About = require("../models/about.hero.model");
const cloudinary = require("../utils/cloudinary");

// @access  Public
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne().sort({ createdAt: -1 });
    if (!about) {
      return res
        .status(2001)
        .json({ success: false, message: "About data not found" });
    }
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @access  Admin
const createAbout = async (req, res) => {
  try {
    // ✅ If using upload.single("image")
    const file = req.file;
    const image = file
      ? { public_id: file.filename, url: file.path }
      : { public_id: "", url: "" };

    const stats = req.body.stats ? JSON.parse(req.body.stats) : [];

    const about = await About.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      image,
      stats,
    });

    res.status(201).json({ success: true, data: about });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @access  Admin
const updateAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about)
      return res
        .status(404)
        .json({ success: false, message: "About not found" });

    // ✅ Handle new image upload
    if (req.file) {
      if (about.image?.public_id) {
        await cloudinary.uploader.destroy(about.image.public_id);
      }
      about.image = { public_id: req.file.filename, url: req.file.path };
    }

    // ✅ Safely update fields
    about.title = req.body.title || about.title;
    about.subtitle = req.body.subtitle || about.subtitle;

    // ✅ Parse stats
    if (req.body.stats) {
      try {
        about.stats = JSON.parse(req.body.stats);
      } catch (err) {
        next(err);
      }
    }

    await about.save();
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @access  Admin
const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about)
      return res
        .status(404)
        .json({ success: false, message: "About not found" });

    if (about.image?.public_id) {
      await cloudinary.uploader.destroy(about.image.public_id);
    }

    await about.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "About deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getAbout, createAbout, updateAbout, deleteAbout };
