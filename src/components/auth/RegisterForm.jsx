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

                {/* Mobile Number */}
                <div className="form-group">
                    <div className="input-with-icon">
                        <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <input type="tel" placeholder="Mobile number" className="form-input has-icon" />
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
