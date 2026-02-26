import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute – Wraps routes that require authentication.
 * If no token is found in localStorage the user is redirected
 * to the /unauthorized page instead of seeing the protected content.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
