import React from 'react';
import './Dashboard.css';

import { Link } from 'react-router-dom';

const NGODashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <span role="img" aria-label="logo">♻️</span> WasteZero
                </div>
                <div className="nav-links">
                    <span className="nav-item active">Dashboard</span>
                    <span className="nav-item">Manage Events</span>
                    <span className="nav-item">Volunteers</span>
                    <span className="nav-item">Messages</span>
                    <span className="nav-item">Profile</span>
                    <Link to="/contact" className="nav-item" style={{ textDecoration: 'none' }}>Contact</Link>
                </div>
                <div className="nav-profile">
                    <a href='/'>Logout</a>
                    <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#ccc' }}></div>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section" style={{ background: 'linear-gradient(135deg, #FFF9C4 0%, #FFF176 100%)' }}>
                    <div className="welcome-text">
                        <h1 style={{ color: '#F57F17' }}>Welcome, Partner NGO 🤝</h1>
                        <p style={{ color: '#F9A825' }}>Manage your events and build your community.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#FBC02D', background: '#FFFDE7' }}>📢</div>
                        <div className="stat-info">
                            <h3>8</h3>
                            <p>Active Events</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#FBC02D', background: '#FFFDE7' }}>👥</div>
                        <div className="stat-info">
                            <h3>24</h3>
                            <p>Pending Applications</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#FBC02D', background: '#FFFDE7' }}>⭐</div>
                        <div className="stat-info">
                            <h3>4.9</h3>
                            <p>Rating</p>
                        </div>
                    </div>
                </div>

                <div className="content-split">
                    <div className="left-column">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="section-title" style={{ marginBottom: 0 }}>Manage Events</h3>
                            <button className="btn-primary" style={{ background: '#FBC02D' }}>+ Create Event</button>
                        </div>

                        <div className="events-list">
                            <div className="event-card">
                                <div className="event-details">
                                    <h4>Beach Cleanup Drive</h4>
                                    <div className="event-meta">
                                        <span>📅 Sat, Apr 8, 2026</span>
                                        <span>👥 15/20 Volunteers</span>
                                    </div>
                                </div>
                                <div className="event-actions">
                                    <button className="btn-primary" style={{ background: 'transparent', color: '#FBC02D', border: '1px solid #FBC02D', marginRight: '0.5rem' }}>Edit</button>
                                    <button className="btn-primary" style={{ background: '#FBC02D' }}>Manage</button>
                                </div>
                            </div>
                        </div>

                        <h3 className="section-title" style={{ marginTop: '2rem' }}>Pending Approvals</h3>
                        <div className="applications-table-container">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Volunteer</th>
                                        <th>Event</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>John Doe</td>
                                        <td>Beach Cleanup</td>
                                        <td>Apr 2, 2026</td>
                                        <td>
                                            <button style={{ marginRight: 5, color: 'green', background: 'none', border: 'none', cursor: 'pointer' }}>✔ Approve</button>
                                            <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✖ Reject</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Jane Smith</td>
                                        <td>Beach Cleanup</td>
                                        <td>Apr 3, 2026</td>
                                        <td>
                                            <button style={{ marginRight: 5, color: 'green', background: 'none', border: 'none', cursor: 'pointer' }}>✔ Approve</button>
                                            <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✖ Reject</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="right-column">
                        <h3 className="section-title">Notifications</h3>
                        <div className="analytics-panel">
                            <div className="message-item">
                                <div className="message-sender">System</div>
                                <div className="message-preview">New event "River Clean" created successfully.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NGODashboard;
