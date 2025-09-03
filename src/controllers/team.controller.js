const Joi = require('joi')
const Team = require("../models/team.model");
const cloudinary = require("cloudinary").v2;

//validation schema - no image validation
const  temasSchema = Joi.object({
  name: Joi.string().trim().required(),
  position:Joi.string().trim().required(),
  bio:Joi.string().trim().required(),
  socialLinks:Joi.object({
    facebook:Joi.string().allow().optional(),
    linkedin:Joi.string().allow().optional(),
    profile:Joi.string().allow().optional()

  }).optional()
});
// Create a new team member
const createTeamMember = async (req, res, next) => {
  try {
    const { name, position, bio, socialLinks } = req.body;
    const image = req.file;

    let imageData = { public_id: "", url: "" };
    if (image) {
      const uploaded = await cloudinary.uploader.upload(image.path);
      imageData = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url
      };
    }

    // Parse socialLinks if sent as JSON string
    let parsedSocialLinks = {};
    if (socialLinks) {
      try {
        parsedSocialLinks = JSON.parse(socialLinks);
      } catch {
        parsedSocialLinks = {};
      }
    }

    const newMember = new Team({
      name,
      position,
      bio,
      image: imageData,
      socialLinks: parsedSocialLinks
    });

    await newMember.save();
    res.status(201).json({ message: "Team member created", data: newMember });
  } catch (error) {
    next(error);
  }
};

// Get all team members
const getAllTeamMembers = async (req, res, next) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

// Get single team member by ID
const getTeamMemberById = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.status(200).json({ data: member });
  } catch (error) {
    next(error);
  }
};

// Update team member
const updateTeamMember = async (req, res, next) => {
  try {
    const { name, position, bio, socialLinks } = req.body;
    const image = req.file;

    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    if (image) {
      // Delete old image from Cloudinary
      if (member.image?.public_id) {
        await cloudinary.uploader.destroy(member.image.public_id);
      }
      const uploaded = await cloudinary.uploader.upload(image.path);
      member.image = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url
      };
    }

    member.name = name || member.name;
    member.position = position || member.position;
    member.bio = bio || member.bio;

    if (socialLinks) {
      try {
        member.socialLinks = JSON.parse(socialLinks);
      } catch {
        // ignore invalid JSON, keep old socialLinks
      }
    }

    await member.save();
    res.status(200).json({ message: "Team member updated", data: member });
  } catch (error) {
    next(error);
  }
};

// Delete team member
const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    if (member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await member.deleteOne();
    res.status(200).json({ message: "Team member deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
};
