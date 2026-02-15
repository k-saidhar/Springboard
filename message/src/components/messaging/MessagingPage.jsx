import React, { useState, useEffect, useRef } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import socketService from '../../services/socketService';
import apiService from '../../services/apiService'; // Assuming we can add axios calls here or import axios directly
import axios from 'axios';
import './Messaging.css';
import { Link } from 'react-router-dom';

const MessagingPage = () => {
    const [currentUserId, setCurrentUserId] = useState('');
    const [chats, setChats] = useState([]); // Connected users
    const [activeChat, setActiveChat] = useState(null); // The user we are talking to
    const [messages, setMessages] = useState({}); // Map chatId to array of messages

    // Helper to get chat ID between two users
    const getChatId = (user1, user2) => {
        return [user1, user2].sort().join('_');
    };

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(decoded.id);
                fetchConnectedUsers(decoded.id, token);
            }
        } catch (e) {
            console.error("Error decoding token", e);
        }
    }, []);

    const fetchConnectedUsers = async (userId, token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/connections', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Transform connections to chat format
            const chatList = response.data.map(conn => ({
                id: conn.id,
                name: conn.name,
                avatar: conn.avatar,
                role: conn.role,
                lastMessage: 'Click to start chatting', // Placeholder until we fetch last message
                connectionId: conn.connectionId
            }));
            setChats(chatList);
        } catch (error) {
            console.error("Error fetching connections:", error);
        }
    };

    useEffect(() => {
        // Setup socket listeners
        socketService.onReceiveMessage((message) => {
            console.log("Received message:", message);
            setMessages(prev => {
                const chatId = message.chatId;
                const existing = prev[chatId] || [];
                // Deduplicate by ID if needed
                if (existing.some(m => m.id === message.id)) return prev;

                return { ...prev, [chatId]: [...existing, message] };
            });

            // Update last message in chat list
            setChats(prev => prev.map(c => {
                // Check if this chat corresponds to the message
                // We don't have chatId in chat object directly, but we can infer or store it
                const cId = [currentUserId, c.id].sort().join('_');
                if (cId === message.chatId) {
                    return { ...c, lastMessage: message.text };
                }
                return c;
            }));
        });

        return () => {
            socketService.offReceiveMessage();
        };
    }, [currentUserId]); // Re-run if user changes (unlikely)

    const handleSelectChat = async (chatUser) => {
        setActiveChat(chatUser);
        const chatId = getChatId(currentUserId, chatUser.id);

        // Join the room
        socketService.joinRoom(chatId);

        // Fetch history if not loaded
        if (!messages[chatId]) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/messages/${chatUser.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(prev => ({
                    ...prev,
                    [chatId]: response.data
                }));
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }
    };

    const handleSendMessage = (text) => {
        if (!activeChat || !currentUserId) return;

        const chatId = getChatId(currentUserId, activeChat.id);
        const messageData = {
            chatId: chatId,
            senderId: currentUserId,
            text: text
        };

        // Emit to server
        socketService.sendMessage(messageData);

        // We don't need to manually update state here because server broadcasts back to sender too?
        // Wait, server code adds to array and broadcasts to 'chatId'.
        // If sender is joined to 'chatId', they will receive it back.
        // But for better UX (instant feedback), we can optimistically add it.
        // However, deduplication logic in onReceiveMessage handles it if we receive it back.
        // Let's rely on server echo for simplicity to avoid duplicate keys until we have IDs.
        // Actually, let's look at server:
        // io.to(chatId).emit(...)
        // If sender joined, they get it.
    };

    return (
        <div style={{ padding: '20px', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            {/* Simple Navbar for context */}
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    ← Back to Dashboard
                </Link>
                <div style={{ marginLeft: 20 }}>
                    <h2 style={{ margin: 0 }}>Messaging</h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Chat with your connections</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <Link to="/network" style={{ textDecoration: 'none', color: '#2196f3' }}>
                        + Find new connections
                    </Link>
                </div>
            </div>

            <div className="messaging-container">
                <ChatList
                    chats={chats}
                    activeChat={activeChat}
                    onSelectChat={handleSelectChat}
                />
                <ChatWindow
                    chat={activeChat}
                    messages={activeChat ? (messages[getChatId(currentUserId, activeChat.id)] || []) : []}
                    onSendMessage={handleSendMessage}
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    );
};

export default MessagingPage;
