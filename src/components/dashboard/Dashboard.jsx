import React, { useState, useEffect } from 'react';
import VolunteerDashboard from './VolunteerDashboard';
import NGODashboard from './NGODashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    // Read role from localStorage, defaulting to volunteer
    // In a real app, this information would come from a user context or API response
    const role = localStorage.getItem('userRole') || 'volunteer';

    return (
        <div>
            {role === 'volunteer' && <VolunteerDashboard />}
            {role === 'ngo' && <NGODashboard />}
            {role === 'admin' && <AdminDashboard />}
        </div>
    );
};

export default Dashboard;
