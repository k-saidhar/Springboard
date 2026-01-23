import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import './LoginForm.css';
import LogoIcon from '../../assets/Logo.svg';

const LoginForm = () => {
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login logic: determine role based on email content
        const email = e.target.elements.email.value.toLowerCase();
        let role = 'volunteer'; // Default role

        if (email.includes('ngo')) {
            role = 'ngo';
        } else if (email.includes('admin')) {
            role = 'admin';
        }

        // Save role to localStorage so Dashboard can pick it up
        localStorage.setItem('userRole', role);
        navigate('/dashboard');
    };

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

            <form className="login-form" onSubmit={handleLogin}>

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
                        <a href="/forgot-password">Forgot password?</a>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-login" type="submit">
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
