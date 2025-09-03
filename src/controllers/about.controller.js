const About = require("../models/about.model");

// Create or Update About stats
const createOrUpdateAbout = async (req, res, next) => {
  try {
    const { client, successCase, professionalLawyer } = req.body;

    let about = await About.findOne();
  

    if (about) {
      // Update existing
      about.client = client !== undefined ? client : about.client;
      about.successCase = successCase !== undefined ? successCase : about.successCase;
      about.professionalLawyer = professionalLawyer !== undefined ? professionalLawyer : about.professionalLawyer;

      await about.save();
      return res.status(200).json({ message: "About updated successfully", data: about });
    }

    // Create new
    const newAbout = new About({
      client,
      successCase,
      professionalLawyer
    });

    await newAbout.save();
    res.status(201).json({ message: "About created successfully", data: newAbout });

  } catch (error) {
    next(error);
  }
};

// Get About stats
const getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(200).json({ message: "No about data found" });
    }

    res.status(200).json({ data: about });
  } catch (error) {
    next(error);
  }
};

// Delete About
const deleteAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "No about data found" });
    }

    await About.deleteOne({ _id: about._id });
    res.status(200).json({ message: "About deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateAbout,
  getAbout,
  deleteAbout
};
