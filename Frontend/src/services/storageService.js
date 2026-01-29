
const STORAGE_KEYS = {
    USER_PROFILE: 'user_profile',
    OPPORTUNITIES: 'opportunities'
};

const storageService = {
    // User Profile
    getUserProfile: () => {
        const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        return profile ? JSON.parse(profile) : { name: '', location: '', bio: '', contact: '' };
    },

    saveUserProfile: (profile) => {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    },

    // Opportunities
    getOpportunities: () => {
        const opportunities = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
        return opportunities ? JSON.parse(opportunities) : [];
    },

    saveOpportunity: (opportunity) => {
        const opportunities = storageService.getOpportunities();
        if (opportunity.id) {
            // Update existing
            const index = opportunities.findIndex(o => o.id === opportunity.id);
            if (index !== -1) {
                opportunities[index] = opportunity;
            }
        } else {
            // Create new
            opportunity.id = Date.now().toString(); // Simple ID generation
            opportunities.push(opportunity);
        }
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
        return opportunity;
    },

    deleteOpportunity: (id) => {
        const opportunities = storageService.getOpportunities();
        const updatedOpportunities = opportunities.filter(o => o.id !== id);
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(updatedOpportunities));
    },

    getOpportunityById: (id) => {
        const opportunities = storageService.getOpportunities();
        return opportunities.find(o => o.id === id);
    }
};

export default storageService;
