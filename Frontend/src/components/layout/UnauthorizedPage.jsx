import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../../assets/Logo.svg';
import ErrorIllustration from '../../assets/Error-Illustration.svg';
import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="unauth-wrapper">
            <div className="unauth-card">

                {/* Brand */}
                <div className="unauth-brand">
                    <img src={LogoIcon} alt="Waste Zero Logo" className="logo-icon" />
                    <h2 className="brand-text">
                        Waste <span style={{ color: '#4CAF50' }}>Zero</span>
                    </h2>
                </div>

                {/* Illustration */}
                <img
                    src={ErrorIllustration}
                    alt="Access Denied Illustration"
                    style={{ width: '140px', marginBottom: '1.5rem' }}
                />

                {/* Message */}
                <h1>Access Denied</h1>
                <p>
                    You need to be logged in to view this page.<br />
                    Please sign in to continue.
                </p>

                {/* Actions */}
                <div className="unauth-actions">
                    <button
                        className="btn-go-login"
                        onClick={() => navigate('/')}
                    >
                        Go to Login
                    </button>

                    <span className="unauth-divider">or</span>

                    <button
                        className="btn-go-register"
                        onClick={() => navigate('/register')}
                    >
                        Create an account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
