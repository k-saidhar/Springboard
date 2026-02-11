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
      .populate("applications.volunteer", "username email mobile location") // Populate volunteer details
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
      .populate("createdBy", "username email")
      .populate("applications.volunteer", "username email mobile location"); // Populate volunteer details

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

// Apply for an opportunity
const applyForOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if already applied
    const alreadyApplied = opportunity.applications.find(
      app => app.volunteer.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this opportunity" });
    }

    opportunity.applications.push({
      volunteer: req.user.id,
      status: 'pending'
    });

    await opportunity.save();
    res.json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (for NGO)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, volunteerId } = req.body;
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check ownership
    if (opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const application = opportunity.applications.find(
      app => app.volunteer.toString() === volunteerId
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await opportunity.save();

    res.json({ message: `Application ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  updateApplicationStatus
};