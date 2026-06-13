import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Enter email/username, 2: Enter OTP, 3: New password, 4: Success
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [empId, setEmpId] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();
    const otpRefs = useRef([]);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Handle OTP input
    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((digit, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = digit;
                }
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + digits.length, 5);
            otpRefs.current[nextIndex]?.focus();
        } else {
            const newOtp = [...otp];
            newOtp[index] = value.replace(/\D/g, '');
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                otpRefs.current[index + 1]?.focus();
            }
        }
    };

    // Handle backspace in OTP input
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // Step 1: Submit username/email to get OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username && !email) {
            setError('Please enter your username or email');
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiRequest('/forgot-password', {
                method: 'POST',
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim()
                })
            });

            const data = await response.json();

            if (data.status === 'ok') {
                setEmpId(data.emp_id);
                setMaskedEmail(data.email || '');
                setStep(2);
                setCountdown(60); // Start countdown for resend
                setSuccess(''); // Clear success message for step 2
            } else {
                setError(data.message || 'Failed to process request. Please try again.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiRequest('/verify-otp', {
                method: 'POST',
                body: JSON.stringify({
                    emp_id: empId,
                    otp: otpString
                })
            });

            const data = await response.json();

            if (data.status === 'ok') {
                setStep(3);
                setSuccess('OTP verified! Please set your new password.');
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiRequest('/reset-password-otp', {
                method: 'POST',
                body: JSON.stringify({
                    emp_id: empId,
                    otp: otp.join(''),
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (data.status === 'ok') {
                setStep(4);
                setSuccess(data.message);
            } else {
                setError(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setError('');
        setIsLoading(true);

        try {
            const response = await apiRequest('/resend-otp', {
                method: 'POST',
                body: JSON.stringify({ emp_id: empId })
            });

            const data = await response.json();

            if (data.status === 'ok') {
                setOtp(['', '', '', '', '', '']);
                setCountdown(60);
                setSuccess('New OTP has been sent to your email.');
            } else {
                setError(data.message || 'Failed to resend OTP.');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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

                    {/* Step 1: Enter Username/Email */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} style={{ height: 'auto' }}>
                            <EmailIcon style={{ fontSize: '48px', color: '#1565C0', marginBottom: '10px' }} />
                            <h1 style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '24px' }}>Forgot Password</h1>
                            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                                Enter your username or email address and we will send you an OTP code.
                            </p>

                            {error && (
                                <div className="login-error-message">
                                    <span>{error}</span>
                                </div>
                            )}

                            <input
                                className="input-login"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                style={{ marginBottom: '10px' }}
                            />

                            <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 10px 0' }}>- or -</p>

                            <input
                                className="input-login"
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                style={{ marginBottom: '20px' }}
                            />

                            <button
                                className="sign-in-button"
                                type="submit"
                                disabled={isLoading || (!username && !email)}
                                style={{ width: '100%', marginBottom: '15px' }}
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/')}
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
                                    cursor: 'pointer'
                                }}
                            >
                                <ArrowBackIcon style={{ fontSize: '18px' }} />
                                Back to Login
                            </button>
                        </form>
                    )}

                    {/* Step 2: Enter OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} style={{ height: 'auto' }}>
                            <LockIcon style={{ fontSize: '48px', color: '#1565C0', marginBottom: '10px' }} />
                            <h1 style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '24px' }}>Enter OTP</h1>
                            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                                {maskedEmail ? (
                                    <>We've sent a 6-digit code to <strong>{maskedEmail}</strong></>
                                ) : (
                                    <>Enter the 6-digit OTP code (check server console for testing)</>
                                )}
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

                            {/* OTP Input Boxes */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                                marginBottom: '20px'
                            }}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => otpRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="6"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        disabled={isLoading}
                                        style={{
                                            width: '45px',
                                            height: '50px',
                                            textAlign: 'center',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1565C0'}
                                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                    />
                                ))}
                            </div>

                            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                                Didn't receive the code?{' '}
                                {countdown > 0 ? (
                                    <span style={{ color: '#999' }}>Resend in {countdown}s</span>
                                ) : (
                                    <span
                                        onClick={handleResendOtp}
                                        style={{ color: '#1565C0', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Resend OTP
                                    </span>
                                )}
                            </p>

                            <button
                                className="sign-in-button"
                                type="submit"
                                disabled={isLoading || otp.join('').length !== 6}
                                style={{ width: '100%', marginBottom: '15px' }}
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep(1); setError(''); setSuccess(''); setOtp(['', '', '', '', '', '']); }}
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
                                    cursor: 'pointer'
                                }}
                            >
                                <ArrowBackIcon style={{ fontSize: '18px' }} />
                                Change Email/Username
                            </button>
                        </form>
                    )}

                    {/* Step 3: Set New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} style={{ height: 'auto' }}>
                            <LockIcon style={{ fontSize: '48px', color: '#1565C0', marginBottom: '10px' }} />
                            <h1 style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '24px' }}>Set New Password</h1>
                            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                                Create a strong password with at least 8 characters.
                            </p>

                            {error && (
                                <div className="login-error-message">
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="password-input-wrapper" style={{ marginBottom: '15px' }}>
                                <input
                                    className="input-login"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <span
                                    className="password-toggle-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </span>
                            </div>

                            <div className="password-input-wrapper" style={{ marginBottom: '20px' }}>
                                <input
                                    className="input-login"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <span
                                    className="password-toggle-icon"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </span>
                            </div>

                            <button
                                className="sign-in-button"
                                type="submit"
                                disabled={isLoading || !newPassword || !confirmPassword}
                                style={{ width: '100%' }}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <CheckCircleIcon style={{ fontSize: '64px', color: '#4caf50', marginBottom: '15px' }} />
                            <h2 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '22px', color: '#333' }}>
                                Password Reset Successful!
                            </h2>
                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>
                                Your password has been successfully reset.
                                <br />
                                You can now login with your new password.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="sign-in-button"
                                style={{ width: '100%' }}
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
