import React from 'react';
import { Link } from 'react-router-dom'; // Assuming Router is ready
import './RegisterForm.css';

const RegisterForm = () => {
    return (
        <div className="register-container">
            <div className="register-header">
                <h2 className="register-title">New Account?</h2>
            </div>

            <form className="register-form" onSubmit={(e) => e.preventDefault()}>

                {/* Username */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input type="text" placeholder="Username" className="form-input has-icon" />
                    </div>
                </div>

                {/* Role Selection */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <select className="form-input has-icon" defaultValue="">
                            <option value="" disabled>Select Role</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="ngo">NGO</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Number */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <input type="tel" placeholder="Mobile number" className="form-input has-icon" />
                    </div>
                </div>

                {/* Location */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input type="text" placeholder="Location" className="form-input has-icon" />
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input type="email" placeholder="Email" className="form-input has-icon" />
                    </div>
                </div>

                {/* Password */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input type="password" placeholder="Password" className="form-input has-icon" />
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input type="password" placeholder="Confirm password" className="form-input has-icon" />
                    </div>
                </div>

                <div className="register-actions">
                    <button className="btn-register">
                        Register
                    </button>
                </div>

                <div className="signin-link">
                    Already have an account? <Link to="/">Sign in</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
