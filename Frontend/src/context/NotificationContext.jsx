import React, { createContext, useState, useEffect, useContext } from 'react';
import socketService from '../services/socketService';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            socketService.connect(token);

            socketService.onNotification((notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Play a subtle sound if desired
                try {
                    // const audio = new Audio('/notification.mp3');
                    // audio.play();
                } catch (e) {
                    console.error("Error playing notification sound", e);
                }
            });
        }

        return () => {
            socketService.disconnect();
        };
    }, []);

    const markAsRead = () => {
        setUnreadCount(0);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
