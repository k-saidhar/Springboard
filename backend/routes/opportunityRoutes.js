const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} = require("../controllers/opportunityController");

// @route   POST /api/opportunities
// @desc    Create new opportunity
// @access  Private
router.post("/", auth, createOpportunity);

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
router.put("/:id", auth, updateOpportunity);

// @route   DELETE /api/opportunities/:id
// @desc    Delete opportunity
// @access  Private
router.delete("/:id", auth, deleteOpportunity);

module.exports = router;