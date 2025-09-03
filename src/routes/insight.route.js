const express = require('express');
const router = express.Router();
const {
  createInsight,
  getAllInsights,
  getInsightById,
  updateInsight,
  deleteInsight
} = require('../controllers/insight.controller');

// Create new Insight
router.post('/', createInsight);

// Get all Insights
router.get('/', getAllInsights);

// Get Insight by ID
router.get('/:id', getInsightById);

// Update Insight by ID
router.put('/:id', updateInsight);

// Delete Insight by ID
router.delete('/:id', deleteInsight);

module.exports = router;
