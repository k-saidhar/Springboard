import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import socketService from '../../services/socketService';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Messaging.css';

const MessagingPage = () => {
    const [currentUserId, setCurrentUserId] = useState('');
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(decoded.id);
                socketService.connect(token);
                fetchInbox(token);

                // Listen for online presence events
                socketService.onOnlineUsers((userIds) => {
                    setOnlineUsers(new Set(userIds.map(String)));
                });
                socketService.onUserOnline((uid) => {
                    setOnlineUsers(prev => new Set([...prev, String(uid)]));
                });
                socketService.onUserOffline((uid) => {
                    setOnlineUsers(prev => {
                        const next = new Set(prev);
                        next.delete(String(uid));
                        return next;
                    });
                });
            } catch (e) {
                console.error("Token decode error", e);
            }
        }
        return () => socketService.offOnlineStatus();
    }, []);

    useEffect(() => {
        if (!currentUserId) return;

        socketService.offReceiveMessage();

        socketService.onReceiveMessage((msg) => {
            const incomingSenderId = msg.from?._id || msg.from;
            const myId = String(currentUserId);

            console.log("Debug IDs -> Incoming:", incomingSenderId, "Me:", myId);

            if (String(incomingSenderId) === myId) {
                console.log("Ignoring my own message from socket");
                return;
            }

            setMessages(prev => {
                const chatId = msg.chatId;
                const currentChatHistory = prev[chatId] || [];

                const isDuplicate = currentChatHistory.some(m =>
                    m.text === msg.text &&
                    new Date(m.timestamp).getTime() === new Date(msg.time).getTime()
                );

                if (isDuplicate) return prev;

                const newMsg = {
                    senderId: incomingSenderId,
                    text: msg.text,
                    timestamp: msg.time || new Date()
                };

                return {
                    ...prev,
                    [chatId]: [...currentChatHistory, newMsg]
                };
            });
        });

        return () => socketService.offReceiveMessage();
    }, [currentUserId]);


    const fetchInbox = async (token) => {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            const myId = decoded.id;
            const res = await axios.get('http://localhost:5000/api/chat', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const formattedChats = res.data.map(chat => {
                const otherUser = chat.participants.find(p => String(p._id) !== String(myId));
                return {
                    id: chat._id,
                    name: otherUser?.username || "Unknown",
                    receiverId: otherUser?._id,
                    lastMessage: chat.lastMessage || "No messages yet",
                    role: otherUser?.role
                };
            });
            setChats(formattedChats);
        } catch (err) { console.error("Inbox load error:", err); }
    };

    const handleSelectChat = async (chat) => {
        setActiveChat(chat);
        socketService.joinRoom(chat.id);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/chat/${chat.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const history = res.data.map(m => ({
                senderId: m.from._id || m.from,
                text: m.text,
                timestamp: m.time
            }));

            setMessages(prev => ({ ...prev, [chat.id]: history }));
        } catch (err) { console.error("History fetch error:", err); }
    };

    const handleSendMessage = async (text) => {
        if (!activeChat || !text.trim()) return;

        const token = localStorage.getItem('token');
        const messageData = {
            chatId: activeChat.id,
            participantId: activeChat.receiverId,
            text: text
        };

        try {
            socketService.sendMessage({ ...messageData, from: currentUserId, to: activeChat.receiverId });
            await axios.post('http://localhost:5000/api/chat/send', messageData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const myNewMsg = { senderId: currentUserId, text: text, timestamp: new Date() };
            setMessages(prev => ({
                ...prev,
                [activeChat.id]: [...(prev[activeChat.id] || []), myNewMsg]
            }));
        } catch (err) { console.error("Send failed:", err); }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (query.length > 2) {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/users?search=${query}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSearchResults(res.data);
            } catch (err) { console.error(err); }
        } else {
            setSearchResults([]);
        }
    };

    const startChat = async (user) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/chat',
                { participantId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSearchTerm('');
            setSearchResults([]);
            await fetchInbox(token);
            handleSelectChat({ id: res.data._id, name: user.username, receiverId: user._id });
        } catch (err) { console.error(err); }
    };

    return (
        <div className="messaging-page-wrapper">
            {/* Header / Navbar Section */}
            <div className="messaging-nav">
                <div className="nav-left">
                    <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
                    <h2 className="page-title">Messaging</h2>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search users to start chat..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-dropdown">
                            {searchResults.map(u => (
                                <div key={u._id} onClick={() => startChat(u)} className="search-result-item">
                                    <div className="user-initials">{u.username.charAt(0).toUpperCase()}</div>
                                    <div className="user-details">
                                        <span className="user-name">{u.username}</span>
                                        <span className="user-role">{u.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Layout */}
            <div className="messaging-main-layout">
                <ChatList
                    chats={chats}
                    activeChat={activeChat}
                    onSelectChat={handleSelectChat}
                />
                <ChatWindow
                    chat={activeChat}
                    messages={activeChat ? (messages[activeChat.id] || []) : []}
                    onSendMessage={handleSendMessage}
                    currentUserId={currentUserId}
                    onlineUsers={onlineUsers}
                />
            </div>
        </div>
    );
};

export default MessagingPage;