const Team = require("../models/team.model");
const cloudinary = require("cloudinary").v2;
const Joi = require("joi");

// Validation schema
const teamSchema = Joi.object({
  name: Joi.string().trim().required(),
  position: Joi.string().trim().required(),
  bio: Joi.string().trim().allow(""),
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().allow("").optional(),
    facebook: Joi.string().uri().allow("").optional()
  }).optional()
});

// Create team member
const createTeamMember = async (req, res, next) => {
  try {
    // Parse socialLinks if sent as string
    if (req.body.socialLinks && typeof req.body.socialLinks === "string") {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (err) {
        req.body.socialLinks = {};
      }
    }

    const { error, value } = teamSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, position, bio, socialLinks } = value;

    let imageData = { public_id: "", url: "" };
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "team" });
      imageData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    const member = new Team({ name, position, bio, image: imageData, socialLinks });
    await member.save();

    res.status(201).json({ message: "Team member created", data: member });
  } catch (err) {
    next(err);
  }
};


// Get all team members
const getAllTeamMembers = async (req, res, next) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    res.status(200).json({ data: members });
  } catch (err) {
    next(err);
  }
};

// Get team member by ID
const getTeamMemberById = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.status(200).json({ data: member });
  } catch (err) {
    next(err);
  }
};


// Update team member
const updateTeamMember = async (req, res, next) => {
  try {
    // Parse socialLinks if sent as string
    if (req.body.socialLinks && typeof req.body.socialLinks === "string") {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (err) {
        req.body.socialLinks = {};
      }
    }

    const { error, value } = teamSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    const { name, position, bio, socialLinks } = value;

    if (req.file) {
      if (member.image?.public_id) await cloudinary.uploader.destroy(member.image.public_id);
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "team" });
      member.image = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    member.name = name;
    member.position = position;
    member.bio = bio;
    member.socialLinks = socialLinks || member.socialLinks;

    await member.save();

    res.status(200).json({ message: "Team member updated", data: member });
  } catch (err) {
    next(err);
  }
};

// Delete team member
const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    if (member.image?.public_id) await cloudinary.uploader.destroy(member.image.public_id);
    await member.deleteOne();

    res.status(200).json({ message: "Team member deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember
};
