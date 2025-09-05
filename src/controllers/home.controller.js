const Home = require("../models/home.model");
const cloudinary = require("cloudinary").v2;

// Helper: upload single file
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "lawfirm/home"
  });
  return { public_id: result.public_id, url: result.secure_url };
};

// Create or Replace Home
const createOrUpdateHome = async (req, res, next) => {
  try {
    let { heroSection, services, testimonials } = req.body;

    // Parse JSON strings if sent from multipart/form-data
    if (typeof heroSection === "string") heroSection = JSON.parse(heroSection);
    if (typeof services === "string") services = JSON.parse(services);
    if (typeof testimonials === "string") testimonials = JSON.parse(testimonials);

    // Upload heroSection banner image
    if (req.files?.bannerImage) {
      const uploaded = await uploadToCloudinary(req.files.bannerImage[0]);
      heroSection.bannerImage = uploaded;
    }

    // Upload services images
    if (req.files?.services && Array.isArray(services)) {
      for (let i = 0; i < services.length; i++) {
        if (req.files.services[i]) {
          const uploaded = await uploadToCloudinary(req.files.services[i]);
          services[i].image = uploaded;
        }
      }
    }

    // Upload testimonials images
    if (req.files?.testimonials && Array.isArray(testimonials)) {
      for (let i = 0; i < testimonials.length; i++) {
        if (req.files.testimonials[i]) {
          const uploaded = await uploadToCloudinary(req.files.testimonials[i]);
          testimonials[i].clientImage = uploaded;
        }
      }
    }

    // Check if a home entry exists
    let home = await Home.findOne();
    if (home) {
      home = await Home.findOneAndUpdate(
        {},
        { heroSection, services, testimonials },
        { new: true }
      );
    } else {
      home = new Home({ heroSection, services, testimonials });
      await home.save();
    }

    res.status(201).json({ message: "Home created/updated successfully", data: home });
  } catch (error) {
    next(error);
  }
};

// Get Home
const getHome = async (req, res, next) => {
  try {
    const home = await Home.findOne();
    if (!home) return res.status(404).json({ message: "Home not found" });
    res.status(200).json({ data: home });
  } catch (error) {
    next(error);
  }
};

// Update Home by ID
const updateHome = async (req, res, next) => {
  try {
    let { heroSection, services, testimonials } = req.body;
    if (typeof heroSection === "string") heroSection = JSON.parse(heroSection);
    if (typeof services === "string") services = JSON.parse(services);
    if (typeof testimonials === "string") testimonials = JSON.parse(testimonials);

    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });

    // Handle new uploads (same as create)
    if (req.files?.bannerImage) {
      const uploaded = await uploadToCloudinary(req.files.bannerImage[0]);
      heroSection.bannerImage = uploaded;
    }

    if (req.files?.services && Array.isArray(services)) {
      for (let i = 0; i < services.length; i++) {
        if (req.files.services[i]) {
          const uploaded = await uploadToCloudinary(req.files.services[i]);
          services[i].image = uploaded;
        }
      }
    }

    if (req.files?.testimonials && Array.isArray(testimonials)) {
      for (let i = 0; i < testimonials.length; i++) {
        if (req.files.testimonials[i]) {
          const uploaded = await uploadToCloudinary(req.files.testimonials[i]);
          testimonials[i].clientImage = uploaded;
        }
      }
    }

    home.heroSection = heroSection || home.heroSection;
    home.services = services || home.services;
    home.testimonials = testimonials || home.testimonials;

    await home.save();
    res.status(200).json({ message: "Home updated successfully", data: home });
  } catch (error) {
    next(error);
  }
};

// Delete Home by ID
const deleteHome = async (req, res, next) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });

    // Delete images from Cloudinary
    if (home.heroSection?.bannerImage?.public_id) {
      await cloudinary.uploader.destroy(home.heroSection.bannerImage.public_id);
    }
    for (const s of home.services) {
      if (s.image?.public_id) await cloudinary.uploader.destroy(s.image.public_id);
    }
    for (const t of home.testimonials) {
      if (t.clientImage?.public_id) await cloudinary.uploader.destroy(t.clientImage.public_id);
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
  updateHome,
  deleteHome
};
