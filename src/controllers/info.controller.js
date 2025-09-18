const Info = require("../models/info.model");
const cloudinary = require("../utils/cloudinary");

const createInfo = async (req, res, next) => {
  try {
    const { title, description, buttonText, buttonLink } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "info",
    });

    const info = await Info.create({
      title,
      description,
      buttonText,
      buttonLink,
      image: {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      },
    });

    res.status(201).json({ data: info });
  } catch (err) {
    next(err);
  }
};

const getInfo = async (req, res, next) => {
  try {
    const infos = await Info.find().sort({ createdAt: -1 });
    res.status(200).json({ data: infos });
  } catch (err) {
    next(err);
  }
};

const updateInfo = async (req, res, next) => {
  try {
    const { title, description, buttonText, buttonLink } = req.body;
    let updateData = { title, description, buttonText, buttonLink };

    if (req.file) {
      // Optional: Find old info to delete image from Cloudinary
      const oldInfo = await Info.findById(req.params.id);
      if (oldInfo && oldInfo.image?.public_id) {
        await cloudinary.uploader.destroy(oldInfo.image.public_id);
      }

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "info",
      });
      updateData.image = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }

    const updated = await Info.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Info not found" });

    res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteInfo = async (req, res, next) => {
  try {
    const deleted = await Info.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Info not found" });

    // Optional: delete image from Cloudinary
    if (deleted.image?.public_id) {
      await cloudinary.uploader.destroy(deleted.image.public_id);
    }

    res.status(200).json({ message: "Info deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInfo,
  getInfo,
  updateInfo,
  deleteInfo,
};
