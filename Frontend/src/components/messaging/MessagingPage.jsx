import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import socketService from '../../services/socketService';
import './Messaging.css';
import { Link } from 'react-router-dom';

const MessagingPage = () => {
    // Mock user for testing if no auth
    const [currentUserId, setCurrentUserId] = useState('');

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(decoded.id);
            }
        } catch (e) {
            console.error("Error decoding token", e);
        }
    }, []);

    const [chats, setChats] = useState([
        { id: 1, name: 'Green Earth NGO', lastMessage: 'See you at the event!', avatar: '' },
        { id: 2, name: 'John Doe', lastMessage: 'Can you help with transport?', avatar: '' },
        { id: 3, name: 'Admin', lastMessage: 'Welcome to the platform!', avatar: '' },
    ]);

    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState({}); // Map chat ID to array of messages

    useEffect(() => {
        // Setup socket listeners
        socketService.onReceiveMessage((message) => {
            setMessages(prev => {
                const chatId = message.chatId || activeChat?.id; // In real app, message should have chatId
                if (!chatId) return prev;

                const newMessages = [...(prev[chatId] || []), message];
                return { ...prev, [chatId]: newMessages };
            });
        });

        return () => {
            socketService.offReceiveMessage();
        };
    }, [activeChat]);

    const handleSelectChat = (chat) => {
        setActiveChat(chat);
        // In a real app, join the room for this chat
        socketService.joinRoom(chat.id);

        // Initialize messages for this chat if empty (Mock data)
        if (!messages[chat.id]) {
            setMessages(prev => ({
                ...prev,
                [chat.id]: [
                    { senderId: 'other', text: `Hello! This is ${chat.name}`, timestamp: Date.now() - 100000 },
                    { senderId: currentUserId, text: 'Hi there!', timestamp: Date.now() - 90000 }
                ]
            }));
        }
    };

    const handleSendMessage = (text) => {
        if (!activeChat) return;

        const newMessage = {
            chatId: activeChat.id,
            senderId: currentUserId,
            text: text,
            timestamp: Date.now()
        };

        // Emit to server
        socketService.sendMessage(newMessage);

        // Optimistically update UI
        setMessages(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
        }));
    };

    return (
        <div style={{ padding: '20px', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            {/* Simple Navbar for context */}
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    ← Back to Dashboard
                </Link>
                <h2 style={{ marginLeft: 20, margin: 0 }}>Messaging</h2>
            </div>

            <div className="messaging-container">
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
                />
            </div>
        </div>
    );
};

export default MessagingPage;
