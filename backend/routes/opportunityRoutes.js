const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  updateApplicationStatus
} = require("../controllers/opportunityController");

// @route   POST /api/opportunities
// @desc    Create new opportunity
// @access  Private
router.post("/", protect, createOpportunity);

// @route   GET /api/opportunities
// @desc    Get all opportunities
// @access  Public
router.get("/", getOpportunities);

// @route   GET /api/opportunities/:id
// @desc    Get opportunity by ID
// @access  Public
router.get("/:id", getOpportunityById);

// @route   PUT /api/opportunities/:id
// @desc    Update opportunity
// @access  Private
router.put("/:id", protect, updateOpportunity);

// @route   DELETE /api/opportunities/:id
// @desc    Delete opportunity
// @access  Private
// @route   DELETE /api/opportunities/:id
// @desc    Delete opportunity
// @access  Private
router.delete("/:id", protect, deleteOpportunity);

// @route   POST /api/opportunities/:id/apply
// @desc    Apply for opportunity
// @access  Private (Volunteer only)
router.post("/:id/apply", protect, applyForOpportunity);

// @route   PUT /api/opportunities/:id/status
// @desc    Update application status
// @access  Private (NGO only)
router.put("/:id/status", protect, updateApplicationStatus);

module.exports = router;