import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        fetchData();
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            // If we are in mock mode
            if (token === 'mock-admin-token') {
                throw new Error("Mock Mode");
            }

            const headers = { 'Authorization': `Bearer ${token}` };

            const usersRes = await fetch('http://localhost:5000/api/admin/users');
            const logsRes = await fetch('http://localhost:5000/api/admin/logs');

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setUsers(usersData);
            }
            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLogs(logsData);
            }
        } catch (error) {
            console.log("Backend not reachable or Mock Mode, using mock data");
            // Mock Data
            setUsers([
                { _id: '1', username: 'Alice Walker', email: 'alice@example.com', role: 'volunteer', status: 'Active' },
                { _id: '2', username: 'Green Future Inc', email: 'contact@greenfuture.org', role: 'NGO', status: 'Active' },
                { _id: '3', username: 'Spam Account', email: 'spam@bad.com', role: 'volunteer', status: 'Blocked' },
                { _id: '4', username: 'John Doe', email: 'john@example.com', role: 'volunteer', status: 'Active' },
            ]);
            setLogs([
                { _id: '1', action: 'User Login', details: 'Alice Walker logged in', timestamp: new Date().toISOString() },
                { _id: '2', action: 'Blocked User', details: 'Admin blocked Spam Account', timestamp: new Date(Date.now() - 3600000).toISOString() },
                { _id: '3', action: 'System Alert', details: 'Database backup completed', timestamp: new Date(Date.now() - 7200000).toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Blocked' ? 'Active' : 'Blocked';
        if (!window.confirm(`Are you sure you want to ${newStatus === 'Blocked' ? 'block' : 'unblock'} this user?`)) return;

        try {
            if (localStorage.getItem('token') === 'mock-admin-token') {
                // Simulate backend update
                setUsers(prevUsers => prevUsers.map(u =>
                    u._id === userId ? { ...u, status: newStatus } : u
                ));
                setLogs(prevLogs => [{
                    _id: Date.now(),
                    action: `${newStatus} User`,
                    details: `Admin ${newStatus.toLowerCase()} user (Mock)`,
                    timestamp: new Date().toISOString()
                }, ...prevLogs]);
                alert(`User ${newStatus.toLowerCase()} successfully (Mock)`);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert(`User ${newStatus.toLowerCase()} successfully`);
                fetchData(); // Refresh data
            } else {
                alert('Failed to update user status');
            }
        } catch (error) {
            // Fallback for network error if not explicitly caught above
            console.error("Error updating user:", error);
            alert("Network error: Could not update user.");
        }
    };

    const ngoCount = users.filter(u => u.role === 'NGO').length;
    const volunteerCount = users.filter(u => u.role === 'volunteer').length; // or standard 'volunteer' 
    // Wait, role in seed was 'volunteer', in schema enum 'volunteer'. 
    // In db for existing users it might be 'volunteer' (lowercase).
    // Let's use flexible check or just role because consistency helps.

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <span role="img" aria-label="logo">♻️</span> WasteZero <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', background: 'black', color: 'white', padding: '2px 6px', borderRadius: 4 }}>ADMIN</span>
                </div>
                <div className="nav-links">
                    <span
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                        style={{ cursor: 'pointer' }}
                    >
                        Dashboard
                    </span>
                    <span
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                        style={{ cursor: 'pointer' }}
                    >
                        Users
                    </span>
                    <span
                        className={`nav-item ${activeTab === 'ngos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ngos')}
                        style={{ cursor: 'pointer' }}
                    >
                        NGOs
                    </span>
                    <span
                        className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                        style={{ cursor: 'pointer' }}
                    >
                        Reports
                    </span>
                    <span className="nav-item">Settings</span>
                    <Link to="/contact" className="nav-item" style={{ textDecoration: 'none' }}>Contact</Link>
                </div>
                <div className="nav-profile">
                    <a href='/' onClick={() => { localStorage.clear(); }}>Logout</a>
                    <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#333' }}></div>
                </div>
            </nav>

            <div className="dashboard-content">
                {activeTab === 'dashboard' && (
                    <>
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
                                    <h3>{users.length}</h3>
                                    <p>Total Users</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#616161', background: '#EEEEEE' }}>🏢</div>
                                <div className="stat-info">
                                    <h3>{ngoCount}</h3>
                                    <p>Registered NGOs</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ color: '#d32f2f', background: '#ffebee' }}>🚩</div>
                                <div className="stat-info">
                                    <h3>{logs.length}</h3>
                                    <p>System Logs</p>
                                </div>
                            </div>
                        </div>

                        <div className="content-split">
                            <div className="left-column">
                                <h3 className="section-title">User Management (Preview)</h3>
                                <div className="applications-table-container">
                                    {loading ? <p>Loading users...</p> : (
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
                                                {users.slice(0, 5).map(user => (
                                                    <tr key={user._id}>
                                                        <td>
                                                            <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.email}</div>
                                                        </td>
                                                        <td>{user.role}</td>
                                                        <td>
                                                            <span className={`badge ${user.status === 'Active' ? 'approved' : 'rejected'}`}>
                                                                {user.status || 'Active'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleToggleBlock(user._id, user.status || 'Active')}
                                                                style={{
                                                                    color: user.status === 'Blocked' ? 'green' : 'red',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {users.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td></tr>}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <button onClick={() => setActiveTab('users')} style={{ background: 'none', border: 'none', color: '#2E7D32', cursor: 'pointer', textDecoration: 'underline' }}>View All Users</button>
                                </div>
                            </div>

                            <div className="right-column">
                                <h3 className="section-title">System Activity Logs</h3>
                                <div className="analytics-panel">
                                    {logs.slice(0, 10).map((log, index) => (
                                        <div key={log._id || index} className="message-item" style={{ borderLeftColor: '#616161' }}>
                                            <div className="message-sender">{log.action}</div>
                                            <div className="message-preview">
                                                {log.details}
                                                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: 4 }}>
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {logs.length === 0 && <p style={{ color: '#666' }}>No logs yet.</p>}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {(activeTab === 'users' || activeTab === 'ngos') && (
                    <div className="section-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ color: '#424242' }}>{activeTab === 'users' ? 'Registered Users' : 'Verified NGOs'}</h2>
                            <div className="search-bar" style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" placeholder="Search..." style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                <button style={{ padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export</button>
                            </div>
                        </div>

                        <div className="applications-table-container">
                            <table className="app-table" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Joined Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => activeTab === 'users' ? u.role.toLowerCase() === 'volunteer' : u.role.toLowerCase() === 'ngo').map(user => (
                                        <tr key={user._id}>
                                            <td style={{ fontWeight: 'bold' }}>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td><span className="badge" style={{ background: user.role === 'NGO' ? '#E8F5E9' : '#E3F2FD', color: '#333' }}>{user.role}</span></td>
                                            <td>{user.location || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${user.status === 'Active' ? 'approved' : 'rejected'}`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleBlock(user._id, user.status || 'Active')}
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '4px',
                                                        border: `1px solid ${user.status === 'Blocked' ? 'green' : '#d32f2f'}`,
                                                        color: user.status === 'Blocked' ? 'green' : '#d32f2f',
                                                        background: 'white',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.filter(u => activeTab === 'users' ? u.role.toLowerCase() === 'volunteer' : u.role.toLowerCase() === 'ngo').length === 0 && (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="section-container" style={{ textAlign: 'center', padding: '50px' }}>
                        <h2>⚠️ Reports Module</h2>
                        <p>This module is currently under development.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
