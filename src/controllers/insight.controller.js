const Insight = require("../models/insight.model");

// Create a new Insight
const createInsight = async (req, res, next) => {
  try {
    const {
      all,
      companyRegistrationAndCompliance,
      foreignInvestment,
      law = "general" // default fallback
    } = req.body;

    if (!all || !companyRegistrationAndCompliance || !foreignInvestment) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newInsight = await Insight.create({
      all,
      companyRegistrationAndCompliance,
      foreignInvestment,
      law
    });

    res.status(201).json({ message: "Insight created", data: newInsight });
  } catch (error) {
    next(error);
  }
};

// Get all Insights
const getAllInsights = async (req, res, next) => {
  try {
    const insights = await Insight.find().sort({ createdAt: -1 });
    res.status(200).json({ data: insights });
  } catch (error) {
    next(error);
  }
};

// Get a single Insight by ID
const getInsightById = async (req, res, next) => {
  try {
    const insight = await Insight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ message: "Insight not found" });
    }
    res.status(200).json({ data: insight });
  } catch (error) {
    next(error);
  }
};

// Update an Insight by ID
const updateInsight = async (req, res, next) => {
  try {
    const { all, companyRegistrationAndCompliance, foreignInvestment, law } = req.body;
    const insight = await Insight.findById(req.params.id);

    if (!insight) {
      return res.status(404).json({ message: "Insight not found" });
    }

    insight.all = all || insight.all;
    insight.companyRegistrationAndCompliance =
      companyRegistrationAndCompliance || insight.companyRegistrationAndCompliance;
    insight.foreignInvestment = foreignInvestment || insight.foreignInvestment;
    insight.law = law || insight.law;

    await insight.save();

    res.status(200).json({ message: "Insight updated", data: insight });
  } catch (error) {
    next(error);
  }
};

// Delete an Insight
const deleteInsight = async (req, res, next) => {
  try {
    const insight = await Insight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ message: "Insight not found" });
    }

    await insight.deleteOne();
    res.status(200).json({ message: "Insight deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInsight,
  getAllInsights,
  getInsightById,
  updateInsight,
  deleteInsight
};
