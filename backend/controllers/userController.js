const User = require("../models/User");

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -otp -otpExpires");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, mobile, location, bio } = req.body; // 'name' maps to 'username' if you want, or keep separate. 
        // The User model has 'username', not 'name'. Let's check how the frontend sends it.
        // Frontend sends 'name', 'location', 'contact' (mobile), 'bio'.
        // User model has 'username', 'mobile', 'location', 'bio'.

        // We should probably allow updating username too, but let's stick to what's requested.
        // Mapping 'name' to 'username' might be tricky if it's unique and they change it to existing.
        // Let's assume for now 'name' from frontend is 'username'.

        if (name) user.username = name;
        if (mobile || req.body.contact) user.mobile = mobile || req.body.contact;
        if (location) user.location = location;
        if (bio) user.bio = bio;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            mobile: updatedUser.mobile,
            location: updatedUser.location,
            bio: updatedUser.bio
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
