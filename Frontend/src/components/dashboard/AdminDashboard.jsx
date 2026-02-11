import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotificationIcon from '../notifications/NotificationIcon';
import ReportsPage from '../reports/ReportsPage';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    //  Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [blockReason, setBlockReason] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token === 'mock-admin-token') throw new Error('Mock');

            const usersRes = await fetch('http://localhost:5000/api/admin/users');
            const logsRes = await fetch('http://localhost:5000/api/admin/logs');

            if (usersRes.ok) setUsers(await usersRes.json());
            if (logsRes.ok) setLogs(await logsRes.json());
        } catch {
            // Mock data
            setUsers([
                { _id: '1', username: 'Alice Walker', email: 'alice@example.com', role: 'volunteer', status: 'Active' },
                { _id: '2', username: 'Green Future Inc', email: 'contact@greenfuture.org', role: 'NGO', status: 'Active' },
                { _id: '3', username: 'Spam Account', email: 'spam@bad.com', role: 'volunteer', status: 'Blocked' },
                { _id: '4', username: 'John Doe', email: 'john@example.com', role: 'volunteer', status: 'Active' },
            ]);

            setLogs([
                { _id: '1', action: 'User Login', details: 'Alice Walker logged in', timestamp: new Date().toISOString() },
                { _id: '2', action: 'Blocked User', details: 'Admin blocked Spam Account', timestamp: new Date(Date.now() - 3600000).toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    //  Open modal
    const openBlockModal = (user) => {
        setSelectedUser(user);
        setBlockReason('');
        setShowModal(true);
    };

    //  Confirm block / unblock
    const confirmToggleBlock = async () => {
        if (!selectedUser) return;

        const newStatus = selectedUser.status === 'Blocked' ? 'Active' : 'Blocked';

        try {
            if (localStorage.getItem('token') === 'mock-admin-token') {
                setUsers(prev =>
                    prev.map(u =>
                        u._id === selectedUser._id ? { ...u, status: newStatus } : u
                    )
                );

                setLogs(prev => [{
                    _id: Date.now(),
                    action: `${newStatus} User`,
                    details: `Admin ${newStatus.toLowerCase()} ${selectedUser.username}`,
                    timestamp: new Date().toISOString()
                }, ...prev]);

                setShowModal(false);
                return;
            }

            await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}/block`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, reason: blockReason })
            });

            fetchData();
            setShowModal(false);
        } catch (err) {
            alert('Failed to update user');
            console.error(err);
        }
    };

    const ngoCount = users.filter(u => u.role === 'NGO').length;
    const volunteerCount = users.filter(u => u.role === 'volunteer').length;

    return (
        <div className="dashboard-container">

            {/* NAVBAR */}
            <nav className="dashboard-nav">
                <div className="nav-brand">♻️ WasteZero <span className="admin-badge">ADMIN</span></div>
                <div className="nav-links">
                    {['dashboard', 'users', 'ngos', 'reports'].map(tab => (
                        <span
                            key={tab}
                            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                    ))}
                    <Link to="/messages" className="nav-item">Messages</Link>
                    <Link to="/profile" className="nav-item">Profile</Link>
                    <NotificationIcon />
                </div>
                <div className="nav-profile">
                    <a href="/" onClick={() => localStorage.clear()}>Logout</a>
                </div>
            </nav>

            {/* DASHBOARD */}
            <div className="dashboard-content">

                {activeTab === 'dashboard' && (
                    <>
                        <h2>Admin Control Panel 🛡️</h2>

                        <div className="stats-grid">
                            <div className="stat-card">👥 {users.length} Users</div>
                            <div className="stat-card">🏢 {ngoCount} NGOs</div>
                            <div className="stat-card">📜 {logs.length} Logs</div>
                        </div>

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
                                            <strong>{user.username}</strong>
                                            <div className="sub">{user.email}</div>
                                        </td>
                                        <td>{user.role}</td>
                                        <td>
                                            <span className={`badge ${user.status === 'Active' ? 'approved' : 'rejected'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="link-btn"
                                                onClick={() => openBlockModal(user)}
                                            >
                                                {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {(activeTab === 'users' || activeTab === 'ngos') && (
                    <table className="app-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users
                                .filter(u =>
                                    activeTab === 'users'
                                        ? u.role === 'volunteer'
                                        : u.role === 'NGO'
                                )
                                .map(user => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            <button
                                                onClick={() => openBlockModal(user)}
                                                className="outline-btn"
                                            >
                                                {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'reports' && <ReportsPage />}
            </div>

            {/*  BLOCK / UNBLOCK MODAL */}
            {showModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className={`modal-icon ${selectedUser.status === 'Blocked' ? 'success' : 'danger'}`}>
                            {selectedUser.status === 'Blocked' ? '✔' : '✖'}
                        </div>

                        <h3>{selectedUser.status === 'Blocked' ? 'Unblock User' : 'Block User'}</h3>
                        <p>
                            Are you sure you want to {selectedUser.status === 'Blocked' ? 'unblock' : 'block'}{' '}
                            <strong>{selectedUser.username}</strong>?
                        </p>

                        {selectedUser.status !== 'Blocked' && (
                            <textarea
                                placeholder="Reason for blocking (optional)"
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                            />
                        )}

                        <div className="modal-actions">
                            <button className="btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button
                                className={`btn ${selectedUser.status === 'Blocked' ? 'success' : 'danger'}`}
                                onClick={confirmToggleBlock}
                            >
                                {selectedUser.status === 'Blocked' ? 'Unblock' : 'Block'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
