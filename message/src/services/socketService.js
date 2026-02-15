import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Make sure this matches backend URL

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            auth: {
                token: token
            }
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinRoom(room) {
        if (this.socket) {
            this.socket.emit('join_chat', room);
        }
    }

    leaveRoom(room) {
        if (this.socket) {
            this.socket.leave(room); // Client side leave, or emit if server needs to know
        }
    }

    sendMessage(messageData) {
        if (this.socket) {
            this.socket.emit('send_message', messageData);
        }
    }

    onReceiveMessage(callback) {
        if (this.socket) {
            this.socket.on('receive_message', callback);
        }
    }

    onNotification(callback) {
        if (this.socket) {
            this.socket.on('notification', callback);
        }
    }

    offReceiveMessage() {
        if (this.socket) {
            this.socket.off('receive_message');
        }
    }
}

export default new SocketService();
