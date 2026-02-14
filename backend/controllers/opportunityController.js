const Opportunity = require("../models/Opportunity");
const User = require("../models/User");
const Notification = require("../models/Notification");
// const Application = require("../models/Application"); // Assuming Application model might not be needed if embedded, but checking imports from source


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

    // Smart Matching Algorithm: Match by location AND skills
    // const skillsArray = skills ? skills.split(',').map(s => s.trim().toLowerCase()) : [];
    const skillsArray = Array.isArray(skills) 
    ? skills.map(s => s.trim().toLowerCase()) 
    : (skills ? skills.split(',').map(s => s.trim().toLowerCase()) : []);
    
    const matchQuery = {
      role: "volunteer",
      location: location
    };

    // If skills specified, match volunteers with those skills
    if (skillsArray.length > 0) {
      matchQuery.skills = { $in: skillsArray };
    }

    const matchedVolunteers = await User.find(matchQuery);

    // Get Socket.IO instance
    const io = req.app.get('io');

    // Send notifications to matched volunteers
    for (const volunteer of matchedVolunteers) {
      const notification = await Notification.create({
        userId: volunteer._id,
        type: "match",
        message: `New opportunity "${title}" matches your profile!`,
        data: {
          opportunityId: opportunity._id,
          ngoId: req.user.id,
          action: 'match'
        }
      });

      // Emit real-time notification
      if (io) {
        io.to(volunteer._id.toString()).emit("new_notification", {
          ...notification.toObject(),
          opportunity
        });
      }
    }

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

    // Check if user owns this opportunity OR is an admin
    if (opportunity.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
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

    // Create notification for NGO about new application
    const ngoNotification = await Notification.create({
      userId: opportunity.createdBy._id,
      type: "application",
      message: `${req.user.username} applied for "${opportunity.title}"`,
      data: {
        opportunityId: opportunity._id,
        volunteerId: req.user.id,
        action: 'created'
      }
    });

    // Emit real-time notification to NGO
    const io = req.app.get('io');
    if (io) {
      io.to(opportunity.createdBy._id.toString()).emit("new_application", {
        ...ngoNotification.toObject(),
        volunteer: req.user,
        opportunity
      });
    }

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

    // Get volunteer details (req.user is NGO)
    // We need to fetch volunteer info to send notification
    // The volunteerId is passed in req.body

    // Create notification for volunteer about status change
    const volunteerNotification = await Notification.create({
      userId: volunteerId,
      type: status === 'accepted' ? "approval" : "rejection",
      message: `Your application for "${opportunity.title}" was ${status}`,
      data: {
        opportunityId: opportunity._id,
        ngoId: req.user.id,
        action: status
      }
    });

    // Emit real-time notification to volunteer
    const io = req.app.get('io');
    if (io) {
      io.to(volunteerId.toString()).emit("application_status_update", {
        ...volunteerNotification.toObject(),
        opportunity,
        status
      });
    }

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