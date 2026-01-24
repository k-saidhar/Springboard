import React from 'react';
import { Link } from 'react-router-dom';
import SplitCard from '../../components/layout/SplitCard';
import forgotImg from "../../assets/Error Illustration.jpg";
import './ForgotPassword.css';

const ForgotIllustration = () => {
    return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '350px' }}>
            <img
                src={forgotImg}
                alt="Forgot Password Illustration"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
            />
            <h1 style={{ marginTop: '2rem', fontSize: '2rem', color: '#1E293B' }}>Waste Zero</h1>
        </div>
    );
};

const ForgotPasswordForm = () => {
    const [step, setStep] = React.useState(1); // 1: Email, 2: OTP, 3: Reset
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email) setStep(2);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.length === 6) setStep(3);
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        if (password && password === confirmPassword) {
            alert("Password Reset Successfully!");
            // Redirect or further logic here
        }
    };

    return (
        <div className="forgot-password-container">
            {step === 1 && (
                <>
                    <h2 className="fp-title">Forgot Password</h2>
                    <p className="fp-subtitle">
                        Enter your registered email address.<br />
                        We will send you OTP.
                    </p>
                    <form onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <label htmlFor="fp-email">Email Address</label>
                            <input
                                type="email"
                                id="fp-email"
                                placeholder="Enter your email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-login" style={{ marginTop: '1rem' }}>
                            Send Code
                        </button>
                    </form>
                </>
            )}

            {step === 2 && (
                <>
                    <h2 className="fp-title">Enter OTP</h2>
                    <p className="fp-subtitle">
                        Enter OTP sent to your email
                    </p>
                    <form onSubmit={handleOtpSubmit}>
                        <div className="form-group">
                            <label htmlFor="fp-otp">OTP Code</label>
                            <input
                                type="text"
                                id="fp-otp"
                                maxLength="6"
                                placeholder="------"
                                className="form-input otp-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem' }}
                                required
                            />
                        </div>
                        <button className="btn-login" style={{ marginTop: '1rem' }}>
                            Reset Password
                        </button>
                    </form>
                </>
            )}

            {step === 3 && (
                <>
                    <h2 className="fp-title">Reset Password</h2>
                    <p className="fp-subtitle">
                        Create a new password for your account.
                    </p>
                    <form onSubmit={handleResetSubmit}>
                        <div className="form-group">
                            <label htmlFor="fp-pass">New Password</label>
                            <input
                                type="password"
                                id="fp-pass"
                                placeholder="New Password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fp-cpass">Retype Password</label>
                            <input
                                type="password"
                                id="fp-cpass"
                                placeholder="Confirm Password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-login" style={{ marginTop: '1rem' }}>
                            Reset
                        </button>
                    </form>
                </>
            )}

            <div className="links" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/" style={{ color: '#4CAF50', fontWeight: 'bold' }}>Back to Login</Link>
            </div>
        </div>
    );
};

function ForgotPassword() {
    return (
        <SplitCard
            leftContent={<ForgotIllustration />}
            rightContent={<ForgotPasswordForm />}
        />
    );
}

export default ForgotPassword;
