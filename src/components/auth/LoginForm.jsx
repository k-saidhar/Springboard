import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './LoginForm.css';
import LogoIcon from '../../assets/Logo.svg';

const LoginForm = () => {
    return (
        <div className="login-container">
            <div className="login-header">
                <div className="brand-logo-container">
                    {/* Custom Logo Asset */}
                    <img src={LogoIcon} alt="Waste Zero Logo" className="logo-icon" />
                    <h2 className="brand-text">
                        Waste <span style={{ color: '#4CAF50' }}>Zero</span>
                    </h2>
                </div>
            </div>

            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="email">Username or Email</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Email"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        className="form-input"
                    />
                    <div className="forgot-password">
                        <a href="#">Forgot password?</a>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-login">
                        Log In
                    </button>
                </div>

                <div className="register-link">
                    Are you new ? <Link to="/register">Register</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
