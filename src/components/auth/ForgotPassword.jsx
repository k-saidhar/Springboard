import React from 'react';
import { Link } from 'react-router-dom';
import SplitCard from '../../components/layout/SplitCard';
import forgotImg from "../../assets/forgot.jpg";
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
    return (
        <div className="forgot-password-container">
            <h2 className="fp-title">Forgot Password</h2>
            <p className="fp-subtitle">
                Enter your registered email address.<br />
                We will send you a reset link.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="fp-email">Email Address</label>
                    <input
                        type="email"
                        id="fp-email"
                        placeholder="Enter your email"
                        className="form-input"
                    />
                </div>

                <button className="btn-login" style={{ marginTop: '1rem' }}>
                    Send reset link
                </button>

                <div className="links" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#4CAF50', fontWeight: 'bold' }}>Back to Login</Link>
                </div>
            </form>
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
