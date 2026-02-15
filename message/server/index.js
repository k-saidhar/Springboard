import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Mock Database
const users = [
    { id: '1', name: 'User One', email: 'user1@example.com', password: 'password', avatar: '', role: 'volunteer', location: 'Bay Area', skills: ['cleaning', 'organizing', 'community outreach'], availability: ['2026-03-15', '2026-03-20', '2026-03-25'] },
    { id: '2', name: 'Green Earth NGO', email: 'ngo@example.com', password: 'password', avatar: '', role: 'ngo', location: 'Bay Area', skills: [], availability: [] },
    { id: '3', name: 'Admin User', email: 'admin@example.com', password: 'password', avatar: '', role: 'admin', location: 'City Center', skills: [], availability: [] },
    { id: '4', name: 'Volunteer Two', email: 'volunteer2@example.com', password: 'password', avatar: '', role: 'volunteer', location: 'Community Center', skills: ['food distribution', 'logistics', 'first aid'], availability: ['2026-03-20', '2026-03-22'] },
    { id: '5', name: 'Volunteer Three', email: 'volunteer3@example.com', password: 'password', avatar: '', role: 'volunteer', location: 'Bay Area', skills: ['cleaning', 'photography', 'social media'], availability: ['2026-03-15', '2026-03-16'] },
    { id: '6', name: 'Volunteer Four', email: 'volunteer4@example.com', password: 'password', avatar: '', role: 'volunteer', location: 'Downtown', skills: ['organizing', 'teaching', 'fundraising'], availability: ['2026-03-18', '2026-03-20'] }
];

// Connection Requests: { id, senderId, receiverId, status: 'pending' | 'accepted' | 'rejected' }
let connections = [];
let messages = []; // { id, chatId, senderId, text, timestamp, isRead }
let notifications = []; // { id, userId, type, message, read, data }

// Helper to find user
const findUser = (id) => users.find(u => u.id === id);

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    const { token } = socket.handshake.auth; // In real app, verify token

    // Join user to their own room for private notifications
    if (token) {
        try {
            // Mock token decoding (assuming token is base64 encoded JSON)
            // In reality, use JWT verification
            const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const userId = decoded.id;
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        } catch (e) {
            console.error('Invalid token for socket connection');
        }
    }

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on('send_message', (messageData) => {
        const { chatId, senderId, text } = messageData;
        const msg = {
            id: Date.now().toString(),
            chatId,
            senderId,
            text,
            timestamp: Date.now(),
            isRead: false
        };
        messages.push(msg);

        // Broadcast to chat room
        io.to(chatId).emit('receive_message', msg);

        // Notify receiver(s) if needed (for unread counts)
        // Here we'd need to know who is in the chat. 
        // For 1-on-1, the chatId might be composed of userIDs or looked up.
        // Simplified: assuming chatId is unique room shared by users.
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// API Routes

// Login (Mock)
app.post('/api/auth/login', (req, res) => {
    const { email, emailOrUsername, password } = req.body;
    const identifier = email || emailOrUsername;
    const user = users.find(u => (u.email === identifier || u.name === identifier) && u.password === password);
    if (user) {
        // Create mock JWT: header.payload.signature
        const payload = JSON.stringify({ id: user.id, name: user.name, role: user.role });
        const token = `mock.${Buffer.from(payload).toString('base64')}.mock`;
        res.json({ token, user: { id: user.id, name: user.name, role: user.role, avatar: user.avatar } });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Register (Mock)
app.post('/api/auth/register', (req, res) => {
    const { username, email, password, role, mobile, location } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.name === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Create new user
    const newUser = {
        id: (users.length + 1).toString(),
        name: username,
        email: email,
        password: password,
        avatar: '',
        role: role || 'volunteer',
        mobile: mobile || '',
        location: location || ''
    };

    users.push(newUser);

    // Create mock JWT token
    const payload = JSON.stringify({ id: newUser.id, name: newUser.name, role: newUser.role });
    const token = `mock.${Buffer.from(payload).toString('base64')}.mock`;

    res.status(201).json({
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            role: newUser.role,
            avatar: newUser.avatar
        }
    });
});


// Get All Users (for Network page)
app.get('/api/users', (req, res) => {
    // Exclude current user from list if 'currentUserId' query param provided
    const currentUserId = req.query.currentUserId;
    const availableUsers = users.filter(u => u.id !== currentUserId).map(u => ({
        id: u.id,
        name: u.name,
        role: u.role,
        avatar: u.avatar
    }));
    res.json(availableUsers);
});

// Get Connections for a user
app.get('/api/connections', (req, res) => {
    const userId = req.headers.authorization?.split(' ')[1] ?
        JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString()).id : null;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userConnections = connections
        .filter(c => (c.senderId === userId || c.receiverId === userId) && c.status === 'accepted')
        .map(c => {
            const otherUserId = c.senderId === userId ? c.receiverId : c.senderId;
            const otherUser = findUser(otherUserId);
            return {
                id: otherUser.id,
                name: otherUser.name,
                avatar: otherUser.avatar,
                role: otherUser.role,
                connectionId: c.id
            };
        });

    res.json(userConnections);
});

// Get Connection Statuses (Sent/Received/Pending)
app.get('/api/connections/status', (req, res) => {
    const userId = req.headers.authorization?.split(' ')[1] ?
        JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString()).id : null;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const statuses = connections.filter(c => c.senderId === userId || c.receiverId === userId);
    res.json(statuses);
});

// Send Connection Request
app.post('/api/connect/request', (req, res) => {
    const { fromId, toId } = req.body;

    if (connections.some(c =>
        (c.senderId === fromId && c.receiverId === toId) ||
        (c.senderId === toId && c.receiverId === fromId)
    )) {
        return res.status(400).json({ message: 'Connection already exists or pending' });
    }

    const newConnection = {
        id: Date.now().toString(),
        senderId: fromId,
        receiverId: toId,
        status: 'pending'
    };
    connections.push(newConnection);

    // Initial Notification
    const notification = {
        id: Date.now().toString(),
        userId: toId,
        type: 'connection_request',
        message: `${findUser(fromId).name} sent you a connection request.`,
        read: false,
        data: { connectionId: newConnection.id, senderId: fromId }
    };
    notifications.push(notification);

    // Emit Socket Event
    io.to(toId).emit('new_notification', notification);
    io.to(toId).emit('connection_request', newConnection);

    res.json(newConnection);
});

// Accept Connection Request
app.post('/api/connect/accept', (req, res) => {
    const { connectionId } = req.body;
    const connection = connections.find(c => c.id === connectionId);

    if (!connection) return res.status(404).json({ message: 'Connection not found' });

    connection.status = 'accepted';

    // Notify Sender
    const notification = {
        id: Date.now().toString(),
        userId: connection.senderId,
        type: 'connection_accepted',
        message: `${findUser(connection.receiverId).name} accepted your connection request.`,
        read: false,
        data: { connectionId: connection.id, acceptorId: connection.receiverId }
    };
    notifications.push(notification);

    io.to(connection.senderId).emit('new_notification', notification);
    io.to(connection.senderId).emit('connection_status_update', connection);
    io.to(connection.receiverId).emit('connection_status_update', connection);

    res.json(connection);
});

// Reject Connection request
app.post('/api/connect/reject', (req, res) => {
    const { connectionId } = req.body;
    const index = connections.findIndex(c => c.id === connectionId);
    if (index !== -1) {
        const connection = connections[index];
        connections.splice(index, 1);

        io.to(connection.senderId).emit('connection_status_update', { ...connection, status: 'rejected' });
        io.to(connection.receiverId).emit('connection_status_update', { ...connection, status: 'rejected' });

        res.json({ message: 'Rejected' });
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

// Get Messages for a specific "Chat" (User-to-User)
app.get('/api/messages/:otherUserId', (req, res) => {
    const userId = req.headers.authorization?.split(' ')[1] ?
        JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString()).id : null;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const otherUserId = req.params.otherUserId;

    // Generate a consistent Chat ID for 1-on-1 (e.g., sorted user IDs)
    const chatId = [userId, otherUserId].sort().join('_');

    const chatMessages = messages.filter(m => m.chatId === chatId);
    res.json(chatMessages);
});

// Get Notifications
app.get('/api/notifications', (req, res) => {
    const userId = req.headers.authorization?.split(' ')[1] ?
        JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString()).id : null;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userNotifs = notifications.filter(n => n.userId === userId);
    res.json(userNotifs);
});

// Get Connections (for messaging)
app.get('/api/connections', (req, res) => {
    const userId = req.headers.authorization?.split(' ')[1] ?
        JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString()).id : null;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Get accepted connections where user is either sender or receiver
    const userConnections = connections
        .filter(c => c.status === 'accepted' && (c.senderId === userId || c.receiverId === userId))
        .map(conn => {
            // Return the other user's info
            const otherUserId = conn.senderId === userId ? conn.receiverId : conn.senderId;
            const otherUser = users.find(u => u.id === otherUserId);

            return {
                id: otherUser?.id || otherUserId,
                name: otherUser?.name || 'Unknown',
                avatar: otherUser?.avatar || '',
                role: otherUser?.role || 'user',
                connectionId: conn.id
            };
        });

    res.json(userConnections);
});

// Mock Opportunities for Dashboard
let opportunities = [
    {
        _id: '101',
        title: 'Beach Clean-Up Drive',
        date: '2026-03-15',
        location: 'Bay Area',
        description: 'Join us to clean up the coast.',
        requiredSkills: ['cleaning', 'organizing'],
        createdBy: { _id: '2', username: 'Green Earth NGO' },
        applications: [
            { volunteer: { _id: '1', username: 'User One', email: 'user1@example.com', location: 'City Center' }, status: 'pending' }
        ],
        matchedVolunteers: []
    },
    {
        _id: '102',
        title: 'Food Donation Camp',
        date: '2026-03-20',
        location: 'Community Center',
        description: 'Distributing food to the needy.',
        requiredSkills: ['food distribution', 'logistics'],
        createdBy: { _id: '2', username: 'Green Earth NGO' },
        applications: [],
        matchedVolunteers: []
    }
];

// Opportunity Routes
app.get('/api/opportunities', (req, res) => {
    res.json(opportunities);
});

app.post('/api/opportunities', (req, res) => {
    const newOpp = {
        _id: Date.now().toString(),
        ...req.body,
        createdBy: { _id: '2', username: 'Green Earth NGO' }, // Mock creator
        applications: []
    };
    opportunities.push(newOpp);
    res.json(newOpp);
});

app.delete('/api/opportunities/:id', (req, res) => {
    opportunities = opportunities.filter(o => o._id !== req.params.id);
    res.json({ message: 'Deleted' });
});

app.post('/api/opportunities/:id/apply', (req, res) => {
    // Extract user from JWT token
    const userId = req.headers.authorization?.split(' ')[1] ?
        JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString()).id : null;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const opp = opportunities.find(o => o._id === req.params.id);
    if (opp) {
        // Check if user already applied
        const alreadyApplied = opp.applications?.find(app =>
            app.volunteer._id === userId || app.volunteer === userId
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this event' });
        }

        // Get user details
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add application
        opp.applications.push({
            volunteer: {
                _id: user.id,
                username: user.name,
                email: user.email,
                location: user.location
            },
            status: 'pending'
        });

        res.json({ message: 'Application submitted successfully', application: opp.applications[opp.applications.length - 1] });
    } else {
        res.status(404).json({ message: 'Opportunity not found' });
    }
});

app.put('/api/opportunities/:id/status', (req, res) => {
    const { volunteerId, status } = req.body;
    const opp = opportunities.find(o => o._id === req.params.id);
    if (opp) {
        const app = opp.applications.find(a => a.volunteer._id === volunteerId);
        if (app) {
            app.status = status;

            // Notify Volunteer
            const notification = {
                id: Date.now().toString(),
                userId: volunteerId,
                type: 'application_status_update',
                message: `Your application for ${opp.title} was ${status}.`,
                read: false,
                data: { opportunityId: opp._id, status }
            };
            notifications.push(notification);
            io.to(volunteerId).emit('application_status_update', notification);

            res.json(opp);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } else {
        res.status(404).json({ message: 'Opportunity not found' });
    }
});

// Match Volunteers to Opportunity
app.post('/api/opportunities/:id/match', (req, res) => {
    const opportunityId = req.params.id;
    const opportunity = opportunities.find(o => o._id === opportunityId);

    if (!opportunity) {
        return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Get all volunteers
    const volunteers = users.filter(u => u.role === 'volunteer');

    // Calculate match score for each volunteer
    const matchedVolunteers = volunteers.map(volunteer => {
        let score = 0;
        let locationScore = 0;
        let skillsScore = 0;
        let availabilityScore = 0;

        // Location Match (40% weight)
        if (volunteer.location && opportunity.location) {
            // Simple string matching (case-insensitive)
            const volLoc = volunteer.location.toLowerCase();
            const oppLoc = opportunity.location.toLowerCase();
            if (volLoc === oppLoc) {
                locationScore = 40;
            } else if (volLoc.includes(oppLoc) || oppLoc.includes(volLoc)) {
                locationScore = 20;
            }
        }

        // Skills Match (40% weight)
        if (volunteer.skills && volunteer.skills.length > 0 && opportunity.requiredSkills && opportunity.requiredSkills.length > 0) {
            const matchingSkills = volunteer.skills.filter(skill =>
                opportunity.requiredSkills.some(reqSkill =>
                    skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                    reqSkill.toLowerCase().includes(skill.toLowerCase())
                )
            );
            const skillMatchRatio = matchingSkills.length / opportunity.requiredSkills.length;
            skillsScore = Math.round(skillMatchRatio * 40);
        }

        // Availability Match (20% weight)
        if (volunteer.availability && volunteer.availability.length > 0 && opportunity.date) {
            const eventDate = opportunity.date.split('T')[0]; // Get date part only
            if (volunteer.availability.includes(eventDate)) {
                availabilityScore = 20;
            }
        }

        score = locationScore + skillsScore + availabilityScore;

        return {
            volunteerId: volunteer.id,
            name: volunteer.name,
            email: volunteer.email,
            location: volunteer.location,
            skills: volunteer.skills,
            matchScore: score,
            breakdown: {
                location: locationScore,
                skills: skillsScore,
                availability: availabilityScore
            }
        };
    });

    // Sort by score (highest first) and return top 10
    const topMatches = matchedVolunteers
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

    // Store matched volunteers in opportunity
    opportunity.matchedVolunteers = topMatches;

    res.json({
        opportunityId: opportunity._id,
        opportunityTitle: opportunity.title,
        matches: topMatches
    });
});


const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server accept connections at http://localhost:${PORT}`);
});
