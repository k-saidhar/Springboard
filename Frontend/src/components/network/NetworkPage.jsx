import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import './NetworkPage.css'; // We'll create this CSS

const NetworkPage = () => {
    const [users, setUsers] = useState([]);
    const [connections, setConnections] = useState([]); // Array of connection objects
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const { socket } = useNotifications();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(decoded.id);
                fetchData(decoded.id, token);
            } catch (e) {
                console.error("Token decode error", e);
            }
        }
    }, []);

    const fetchData = async (userId, token) => {
        try {
            setLoading(true);
            const [usersRes, connectionsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/users?currentUserId=${userId}`),
                axios.get('http://localhost:5000/api/connections/status', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setUsers(usersRes.data);
            setConnections(connectionsRes.data);
        } catch (err) {
            console.error("Error fetching network data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/connections/request', {
                toId: userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistically update
            setConnections(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Connection request failed", err);
            alert("Failed to send connection request");
        }
    };

    const handleAccept = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const connection = connections.find(c =>
                (c.senderId === userId && c.receiverId === currentUserId)
            );
            if (!connection) return;

            await axios.post('http://localhost:5000/api/connections/accept', {
                connectionId: connection._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setConnections(prev => prev.map(c =>
                c._id === connection._id ? { ...c, status: 'accepted' } : c
            ));
        } catch (err) {
            console.error("Accept failed", err);
            alert("Failed to accept request");
        }
    };

    const getConnectionStatus = (userId) => {
        const connection = connections.find(c =>
            (c.senderId === currentUserId && c.receiverId === userId) ||
            (c.senderId === userId && c.receiverId === currentUserId)
        );

        if (!connection) return 'connect';
        if (connection.status === 'accepted') return 'connected';
        if (connection.status === 'pending') {
            return connection.senderId === currentUserId ? 'sent' : 'received';
        }
        return 'connect';
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', marginRight: 15, fontSize: '1.2rem' }}>
                        ←
                    </Link>
                    <h1>Network</h1>
                </div>
                <Link to="/messages" style={{ textDecoration: 'none', color: '#2196f3', fontWeight: 'bold' }}>
                    Go to Messages
                </Link>
            </div>

            {loading ? (
                <div>Loading network...</div>
            ) : (
                <div className="network-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {users.map(user => {
                        const status = getConnectionStatus(user._id);
                        return (
                            <div key={user._id} className="user-card" style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: '#eee',
                                    margin: '0 auto 15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: '#666'
                                }}>
                                    {user.username.charAt(0)}
                                </div>
                                <h3 style={{ margin: '0 0 5px', fontSize: '1.1rem' }}>{user.username}</h3>
                                <p style={{ margin: '0 0 15px', color: '#666', fontSize: '0.9rem' }}>{user.role}</p>

                                {status === 'connect' && (
                                    <button
                                        onClick={() => handleConnect(user._id)}
                                        style={{ background: '#2196f3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                                    >
                                        Connect
                                    </button>
                                )}
                                {status === 'sent' && (
                                    <button disabled style={{ background: '#e0e0e0', color: '#666', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'default', width: '100%' }}>
                                        Request Sent
                                    </button>
                                )}
                                {status === 'received' && (
                                    <button
                                        onClick={() => handleAccept(user._id)}
                                        style={{ background: '#4caf50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                                    >
                                        Accept Request
                                    </button>
                                )}
                                {status === 'connected' && (
                                    <div style={{ color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <span>✓ Connected</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {users.length === 0 && !loading && (
                <div style={{ textAlign: 'center', margin: '40px', color: '#666' }}>
                    No other users found in the network yet.
                </div>
            )}
        </div>
    );
};

export default NetworkPage;
