import React, { useState, useEffect } from 'react';
import storageService from '../../services/storageService';
import { Link } from 'react-router-dom';
import '../layout/RegisterPage.css'; // Reuse RegisterPage layout styles
import '../auth/RegisterForm.css';   // Reuse Form styles

// Assets
import Character from '../../assets/Character.svg';
import TopLeftPlant from '../../assets/Top left plant.svg';
import RightSideLeaf from '../../assets/Right side leaf.svg';
import BottomRightPlant from '../../assets/Bottom right.svg';

// Icons
import { FaUser, FaMapMarkerAlt, FaPhone, FaAddressCard } from 'react-icons/fa';

const UserProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        location: '', // Changed from email to location
        bio: '',
        contact: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedProfile = storageService.getUserProfile();
        // Ensure location is initialized if migrating from old data
        if (!storedProfile.location && storedProfile.email) {
            // storedProfile.location = ''; // Or keep existing email logic if needed, but user asked to replace
        }
        setProfile(prev => ({ ...prev, ...storedProfile }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        storageService.saveUserProfile(profile);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="register-page-container">
            {/* Background/Decor Assets */}
            <img src={TopLeftPlant} alt="" className="decor-top-left" />
            <img src={RightSideLeaf} alt="" className="decor-right-side" />

            <div className="register-content-wrapper">
                <img src={Character} alt="Character" className="decor-character" />

                {/* Reuse Register Card Panel */}
                <div className="register-card-panel" style={{ minHeight: 'auto' }}>

                    <div className="register-container">
                        <div className="register-header">
                            <h2 className="register-title">My Profile</h2>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Manage your personal details</p>
                        </div>

                        {message && <div className="error-message" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#c8e6c9' }}>{message}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input has-icon"
                                        placeholder="Full Name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location Field (Replaced Email) */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaMapMarkerAlt className="input-icon" />
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input has-icon"
                                        placeholder="Location"
                                        value={profile.location}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Contact Field */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="tel"
                                        name="contact"
                                        className="form-input has-icon"
                                        placeholder="Mobile Number"
                                        value={profile.contact}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            {/* Bio Field */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaAddressCard className="input-icon" style={{ top: '15px' }} />
                                    <textarea
                                        name="bio"
                                        className="form-input has-icon"
                                        placeholder="Bio / About Yourself"
                                        rows="3"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%', resize: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ marginTop: '1rem' }}>
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        className="btn-register"
                                        onClick={() => setIsEditing(true)}
                                        style={{ backgroundColor: '#FBC02D' }} // Yellow for Edit
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <button
                                            type="submit"
                                            className="btn-register"
                                            style={{ backgroundColor: '#4CAF50' }} // Green for Save
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-register"
                                            onClick={() => setIsEditing(false)}
                                            style={{ backgroundColor: '#9e9e9e' }} // Grey for Cancel
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>

                        <div className="signin-link" style={{ marginTop: '1rem' }}>
                            <Link to="/dashboard">Back to Dashboard</Link>
                        </div>
                    </div>

                    <img src={BottomRightPlant} alt="" className="decor-bottom-right" />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
