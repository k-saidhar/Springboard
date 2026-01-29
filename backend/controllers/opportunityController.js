const Opportunity = require("../models/Opportunity");

// Create new opportunity
const createOpportunity = async (req, res) => {
  try {
    const { title, description, skills, duration, location, date } = req.body;
    
    const opportunity = new Opportunity({
      title,
      description,
      skills,
      duration,
      location,
      date,
      createdBy: req.user.id
    });

    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all opportunities
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get opportunity by ID
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("createdBy", "username email");
    
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update opportunity
const updateOpportunity = async (req, res) => {
  try {
    const { title, description, skills, duration, location, date } = req.body;
    
    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    
    // Check if user owns this opportunity
    if (opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { title, description, skills, duration, location, date },
      { new: true }
    ).populate("createdBy", "username email");
    
    res.json(updatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    
    // Check if user owns this opportunity
    if (opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
};