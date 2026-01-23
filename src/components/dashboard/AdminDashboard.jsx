import React from 'react';
import './Dashboard.css';

const AdminDashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <span role="img" aria-label="logo">♻️</span> WasteZero <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', background: 'black', color: 'white', padding: '2px 6px', borderRadius: 4 }}>ADMIN</span>
                </div>
                <div className="nav-links">
                    <span className="nav-item active">Dashboard</span>
                    <span className="nav-item">Users</span>
                    <span className="nav-item">NGOs</span>
                    <span className="nav-item">Reports</span>
                    <span className="nav-item">Settings</span>
                </div>
                <div className="nav-profile">
                    <a href='/'>Logout</a>
                    <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#333' }}></div>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section" style={{ background: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)' }}>
                    <div className="welcome-text">
                        <h1 style={{ color: '#424242' }}>Admin Control Panel 🛡️</h1>
                        <p style={{ color: '#616161' }}> Oversee platform activity and manage users.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#616161', background: '#EEEEEE' }}>👥</div>
                        <div className="stat-info">
                            <h3>1,250</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#616161', background: '#EEEEEE' }}>🏢</div>
                        <div className="stat-info">
                            <h3>45</h3>
                            <p>Registered NGOs</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#d32f2f', background: '#ffebee' }}>🚩</div>
                        <div className="stat-info">
                            <h3>12</h3>
                            <p>Open Reports</p>
                        </div>
                    </div>
                </div>

                <div className="content-split">
                    <div className="left-column">
                        <h3 className="section-title">User Management</h3>
                        <div className="applications-table-container">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Alice Walker</td>
                                        <td>Volunteer</td>
                                        <td><span className="badge approved">Active</span></td>
                                        <td>
                                            <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Block</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Green Future Inc</td>
                                        <td>NGO</td>
                                        <td><span className="badge approved">Verified</span></td>
                                        <td>
                                            <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Block</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Spam Account</td>
                                        <td>Volunteer</td>
                                        <td><span className="badge rejected">Blocked</span></td>
                                        <td>
                                            <button style={{ color: 'green', background: 'none', border: 'none', cursor: 'pointer' }}>Unblock</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="right-column">
                        <h3 className="section-title">System Health</h3>
                        <div className="analytics-panel">
                            <div className="message-item" style={{ borderLeftColor: '#616161' }}>
                                <div className="message-sender">Server Status</div>
                                <div className="message-preview">All systems operational. Uptime: 99.9%</div>
                            </div>
                            <div className="message-item" style={{ borderLeftColor: '#d32f2f' }}>
                                <div className="message-sender">Security Alert</div>
                                <div className="message-preview">Multiple failed login attempts from IP 192.168.1.5</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
