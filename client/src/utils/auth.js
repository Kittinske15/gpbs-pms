// Authentication utility functions
// Central War Room Security Policy compliance

// API configuration - same logic as api.js
const getApiBaseUrl = () => {
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5001';
    }
    return 'http://ibsdo.com:5001';
};
const API_BASE_URL = getApiBaseUrl();

// Server-side logout (Policy 5.2.3.6)
export const logout = async (reason = '') => {
    const token = localStorage.getItem('token');

    // Call server-side logout to blacklist token and log the logout
    if (token) {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: reason || 'User initiated logout' })
            });
        } catch (error) {
            console.error('Error during server-side logout:', error);
        }
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionTimeout');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('mustChangePassword');

    // Redirect to external login page
    window.location.href = 'https://ibsdo.com/true-visions-pms/';
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Check session timeout (Policy 5.2.3.9 - 30 minutes inactivity)
    const lastActivity = localStorage.getItem('lastActivity');
    const sessionTimeout = parseInt(localStorage.getItem('sessionTimeout')) || 30;

    if (lastActivity) {
        const inactiveTime = (Date.now() - parseInt(lastActivity)) / 1000 / 60; // in minutes
        if (inactiveTime > sessionTimeout) {
            logout('Session expired due to inactivity');
            return false;
        }
    }

    return true;
};

export const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

// Update last activity timestamp (call on user interactions)
// Throttled to avoid too many localStorage writes
let lastActivityUpdate = 0;
const ACTIVITY_THROTTLE_MS = 5000; // Update at most every 5 seconds

export const updateActivity = () => {
    const now = Date.now();
    if (localStorage.getItem('token') && (now - lastActivityUpdate > ACTIVITY_THROTTLE_MS)) {
        localStorage.setItem('lastActivity', now.toString());
        lastActivityUpdate = now;
    }
};

// Force update activity (bypass throttle) - use for important actions
export const forceUpdateActivity = () => {
    if (localStorage.getItem('token')) {
        const now = Date.now();
        localStorage.setItem('lastActivity', now.toString());
        lastActivityUpdate = now;
    }
};

// Check if password change is required
export const mustChangePassword = () => {
    return localStorage.getItem('mustChangePassword') === 'true';
};

// Session monitoring - checks every minute for timeout
let sessionMonitorInterval = null;
let activityTrackingInitialized = false;

export const startSessionMonitor = () => {
    if (sessionMonitorInterval) return;

    sessionMonitorInterval = setInterval(() => {
        if (!isAuthenticated()) {
            stopSessionMonitor();
        }
    }, 60000); // Check every minute
};

export const stopSessionMonitor = () => {
    if (sessionMonitorInterval) {
        clearInterval(sessionMonitorInterval);
        sessionMonitorInterval = null;
    }
};

// Activity event handler (bound once)
const handleActivity = () => {
    updateActivity();
};

// Initialize activity tracking on user interactions
// Only initializes once to prevent duplicate event listeners
export const initActivityTracking = () => {
    if (activityTrackingInitialized) return;

    // Listen to many types of user interactions
    const events = [
        'mousedown',
        'mousemove',
        'keydown',
        'keypress',
        'scroll',
        'touchstart',
        'touchmove',
        'click',
        'wheel'
    ];

    events.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
    });

    // Also track visibility changes - if user comes back to tab, update activity
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            forceUpdateActivity();
        }
    });

    // Track focus on window
    window.addEventListener('focus', forceUpdateActivity);

    activityTrackingInitialized = true;
    startSessionMonitor();

    // Set initial activity
    forceUpdateActivity();
};

// Cleanup activity tracking (only call on full logout/app unmount)
export const cleanupActivityTracking = () => {
    if (!activityTrackingInitialized) return;

    const events = [
        'mousedown',
        'mousemove',
        'keydown',
        'keypress',
        'scroll',
        'touchstart',
        'touchmove',
        'click',
        'wheel'
    ];

    events.forEach(event => {
        document.removeEventListener(event, handleActivity);
    });

    window.removeEventListener('focus', forceUpdateActivity);

    activityTrackingInitialized = false;
    stopSessionMonitor();
};

// Log page access for audit trail (Policy 5.2.3.6)
export const logPageAccess = async (pagePath, pageTitle) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        await fetch(`${API_BASE_URL}/log-page-access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ pagePath, pageTitle })
        });
    } catch (error) {
        console.error('Error logging page access:', error);
    }
};
