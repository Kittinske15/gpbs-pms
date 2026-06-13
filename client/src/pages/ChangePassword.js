import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { getUser, logout } from '../utils/auth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
    const navigate = useNavigate();
    const user = getUser();

    // Check if this is a forced password change (first time login)
    useEffect(() => {
        const mustChange = localStorage.getItem('mustChangePassword');
        setIsFirstTimeLogin(mustChange === 'true');
    }, []);

    // Password strength validation (Policy 5.2.3.6)
    const passwordRequirements = {
        minLength: newPassword.length >= 8,
        hasLetter: /[a-zA-Z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
        passwordsMatch: newPassword === confirmPassword && newPassword !== ''
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!allRequirementsMet) {
            setError('Please meet all password requirements');
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiRequest('/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    username: user?.c_username,
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (data.status === 'ok') {
                setSuccess('Password changed successfully! Redirecting to home...');
                localStorage.removeItem('mustChangePassword');

                // Redirect to home after 2 seconds (user stays logged in)
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                setError(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const RequirementItem = ({ met, text }) => (
        <div className="password-requirement" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            {met ? (
                <CheckCircleIcon style={{ color: '#4caf50', fontSize: '16px' }} />
            ) : (
                <CancelIcon style={{ color: '#f44336', fontSize: '16px' }} />
            )}
            <span style={{ fontSize: '12px', color: met ? '#4caf50' : '#666' }}>{text}</span>
        </div>
    );

    return (
        <div className="login-body">
            <div className="security-warning-banner">
                <LockIcon style={{ fontSize: '14px', marginRight: '5px' }} />
                <span>
                    This system is the property of GPBS. Unauthorized access is strictly prohibited.
                </span>
            </div>

            <div className="container" id="container" style={{ maxWidth: '450px', minHeight: 'auto' }}>
                <div style={{ padding: '40px', width: '100%', boxSizing: 'border-box' }}>
                    <form onSubmit={handleSubmit} style={{ height: 'auto' }}>
                        <LockIcon style={{ fontSize: '48px', color: '#1565C0', marginBottom: '10px' }} />
                        <h1 style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '24px' }}>Change Password</h1>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                            {isFirstTimeLogin
                                ? 'Your password must be changed to comply with security policy.'
                                : 'Enter your current password and choose a new password.'}
                        </p>

                        {error && (
                            <div className="login-error-message">
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div style={{
                                backgroundColor: '#e8f5e9',
                                border: '1px solid #a5d6a7',
                                borderRadius: '4px',
                                padding: '8px 12px',
                                marginBottom: '10px',
                                color: '#2e7d32',
                                fontSize: '13px'
                            }}>
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Current Password */}
                        <div className="password-input-wrapper" style={{ marginBottom: '8px' }}>
                            <input
                                className="input-login"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>

                        {/* New Password */}
                        <div className="password-input-wrapper" style={{ marginBottom: '8px' }}>
                            <input
                                className="input-login"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="password-input-wrapper" style={{ marginBottom: '15px' }}>
                            <input
                                className="input-login"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>

                        {/* Password Requirements */}
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            padding: '12px',
                            borderRadius: '4px',
                            marginBottom: '20px',
                            textAlign: 'left'
                        }}>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                                Password Requirements:
                            </p>
                            <RequirementItem met={passwordRequirements.minLength} text="At least 8 characters" />
                            <RequirementItem met={passwordRequirements.hasLetter} text="Contains a letter (a-z, A-Z)" />
                            <RequirementItem met={passwordRequirements.hasNumber} text="Contains a number (0-9)" />
                            <RequirementItem met={passwordRequirements.hasSpecialChar} text="Contains a special character (!@#$%...)" />
                            <RequirementItem met={passwordRequirements.passwordsMatch} text="Passwords match" />
                        </div>

                        <button
                            className="sign-in-button"
                            type="submit"
                            disabled={!allRequirementsMet || isLoading}
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            {isLoading ? 'Changing Password...' : 'Change Password'}
                        </button>

                        {!isFirstTimeLogin && (
                            <button
                                type="button"
                                onClick={() => navigate('/home')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px',
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    color: '#666',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                            >
                                <ArrowBackIcon style={{ fontSize: '18px' }} />
                                Cancel
                            </button>
                        )}

                        <p style={{ fontSize: '11px', color: '#666', marginTop: '15px' }}>
                            Note: You cannot reuse any of your last 5 passwords.<br />
                            Password can only be changed once every 24 hours.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
