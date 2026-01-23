import React from 'react';
import './Dashboard.css';

const VolunteerDashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <span role="img" aria-label="logo">♻️</span> WasteZero
                </div>
                <div className="nav-links">
                    <span className="nav-item active">Dashboard</span>
                    <span className="nav-item">Events</span>
                    <span className="nav-item">My Applications</span>
                    <span className="nav-item">Messages</span>
                    <span className="nav-item">Profile</span>
                </div>
                <div className="nav-profile">
                    <a href='/'>Logout</a>
                    <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#ccc' }}></div>
                </div>
            </nav>

            <div className="dashboard-content">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-text">
                        <h1>Welcome, Volunteer 👋</h1>
                        <p>Track your activities and make a positive impact today 🌍</p>
                    </div>
                    <div className="welcome-illustration">
                        🌱
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <h3>12</h3>
                            <p>Total Applications</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                            <h3>5</h3>
                            <p>Approved Events</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>3</h3>
                            <p>Completed Events</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🍃</div>
                        <div className="stat-info">
                            <h3>87%</h3>
                            <p>Impact Score</p>
                        </div>
                    </div>
                </div>

                <div className="content-split">
                    {/* Left Column */}
                    <div className="left-column">
                        <h3 className="section-title">Upcoming Events</h3>
                        <div className="events-list">
                            {/* Event Card 1 */}
                            <div className="event-card">
                                <div className="event-details">
                                    <h4>Beach Cleanup Drive</h4>
                                    <div className="event-meta">
                                        <span>📍 Ocean View Beach</span>
                                        <span>📅 Sat, Apr 8, 2026</span>
                                    </div>
                                </div>
                                <div className="event-actions">
                                    <span className="badge approved">Approved</span>
                                    <button className="btn-primary" style={{ marginLeft: '1rem' }}>View Details</button>
                                </div>
                            </div>
                            {/* Event Card 2 */}
                            <div className="event-card">
                                <div className="event-details">
                                    <h4>City Park Cleanup</h4>
                                    <div className="event-meta">
                                        <span>📍 Greenwood Park</span>
                                        <span>📅 Sun, Apr 10, 2026</span>
                                    </div>
                                </div>
                                <div className="event-actions">
                                    <span className="badge pending">Pending</span>
                                    <button className="btn-primary" style={{ marginLeft: '1rem' }}>View Details</button>
                                </div>
                            </div>
                        </div>

                        <h3 className="section-title" style={{ marginTop: '2rem' }}>My Applications</h3>
                        <div className="applications-table-container">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Event Name</th>
                                        <th>NGO</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Beach Cleanup</td>
                                        <td>Green Earth NGO</td>
                                        <td><span className="badge approved">Approved</span></td>
                                        <td>→</td>
                                    </tr>
                                    <tr>
                                        <td>Recycling Drive</td>
                                        <td>Eco Warriors</td>
                                        <td><span className="badge pending">Pending</span></td>
                                        <td>→</td>
                                    </tr>
                                    <tr>
                                        <td>Neighborhood Cleanup</td>
                                        <td>Clean City Initiative</td>
                                        <td><span className="badge rejected">Rejected</span></td>
                                        <td>→</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        <h3 className="section-title">Analytics / Impact</h3>
                        <div className="analytics-panel">
                            <div className="message-item">
                                <div className="message-sender">Green Earth NGO</div>
                                <div className="message-preview">Your application for the Beach Clean-Up drive approved. See you there!</div>
                            </div>
                            <div className="message-item">
                                <div className="message-sender">Admin</div>
                                <div className="message-preview">Reminder: Don't forget the City Park Cleanup this Sunday!</div>
                            </div>
                            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>View Messages {'>'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
