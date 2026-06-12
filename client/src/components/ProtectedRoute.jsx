import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
    isAuthenticated,
    initActivityTracking,
    mustChangePassword,
    logPageAccess,
    forceUpdateActivity
} from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    // Initialize activity tracking once when component mounts
    useEffect(() => {
        // Initialize session activity tracking (Policy 5.2.3.9)
        // This only runs once due to the check inside initActivityTracking
        initActivityTracking();

        // No cleanup on route changes - we want to keep tracking activity
        // Activity tracking will be cleaned up on logout
    }, []);

    // Log page access and update activity on route changes
    useEffect(() => {
        // Update activity on every page navigation
        forceUpdateActivity();

        // Log page access for audit trail (Policy 5.2.3.6)
        if (isAuthenticated()) {
            logPageAccess(location.pathname, document.title || location.pathname);
        }
    }, [location.pathname]);

    // Check authentication status (includes session timeout check)
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    // Check if password change is required (Policy 5.2.3.6)
    if (mustChangePassword()) {
        return <Navigate to="/change-password" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
