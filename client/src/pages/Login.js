import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // prevent page reload
        setError(''); // clear any previous errors
        setIsLocked(false);

        try {
            const response = await apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify({
                    c_username: username,
                    c_password: password
                })
            });

            const data = await response.json();

            if (data.status === 'ok') {
                // Store the JWT token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user[0]));
                localStorage.setItem('sessionTimeout', data.sessionTimeout || 30);
                localStorage.setItem('lastActivity', Date.now().toString());

                // Check if password change is required (Policy 5.2.3.6)
                if (data.mustChangePassword) {
                    localStorage.setItem('mustChangePassword', 'true');
                    navigate('/change-password');
                } else {
                    localStorage.removeItem('mustChangePassword');
                    navigate('/home');
                }
            } else {
                // Handle various error response formats
                let errorMessage = 'Login failed';

                if (typeof data.message === 'string' && data.message) {
                    errorMessage = data.message;
                } else if (data.error && typeof data.error === 'string') {
                    errorMessage = data.error;
                } else if (data.fatal || (data.message && data.message.fatal)) {
                    errorMessage = 'Invalid username or password';
                } else if (!response.ok) {
                    errorMessage = 'Server error. Please try again later.';
                }

                // Check if account is locked
                if (data.locked) {
                    setIsLocked(true);
                }

                setError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="login-body">
            {/* Security Warning Banner - Policy 5.2.3.5 */}
            <div className="security-warning-banner">
                <LockIcon style={{ fontSize: '14px', marginRight: '5px' }} />
                <span>
                    This system is the property of GPBS. Unauthorized access is strictly prohibited.
                    All activities are monitored and logged for security purposes.
                </span>
            </div>

            <div className="container" id="container">
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <h1 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Sign in</h1>

                        {/* Error message with lock icon if account is locked */}
                        {error && (
                            <div className={`login-error-message ${isLocked ? 'locked' : ''}`}>
                                {isLocked && <LockIcon style={{ fontSize: '16px', marginRight: '5px' }} />}
                                <span>{error}</span>
                            </div>
                        )}

                        <input
                            className="input-login"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLocked}
                        />
                        <div className="password-input-wrapper">
                            <input
                                className="input-login"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLocked}
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>
                        <a className="link" href={process.env.PUBLIC_URL + "/forgot-password"}>Forgot your password?</a>
                        <button
                            className="sign-in-button"
                            type="submit"
                            disabled={isLocked}
                        >
                            {isLocked ? 'Account Locked' : 'Sign In'}
                        </button>

                        <p className="first-time-notice">
                            First time login? Click <a href={process.env.PUBLIC_URL + "/forgot-password"}>"Forgot your password?"</a> to set up your password via email.
                        </p>

                        {/* Security notice */}
                        <p className="security-notice">
                            Your session will automatically expire after 30 minutes of inactivity.
                        </p>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p className="p-class">To keep connected with us please login with your personal info</p>
                            <a className="ghost" href="/home">Sign In</a>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <div className="login-true">
                                <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
