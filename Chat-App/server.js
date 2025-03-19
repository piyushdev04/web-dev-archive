const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store usernames with socket IDs

const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Set username when received form client
    socket.on('setUsername', (username) => {
        if (username && username.trim()) {
            users[socket.id] = username.trim();
            io.emit('userConnected', `${users[socket.id]} joined the chat`);
        } else {
            users[socket.id] = `User_${socket.id.slice(0, 4)}`;
            io.emit('userConnected', `${users[socket.id]} joined the chat`);
        }
    });

    // Broadcast chat massages with username
    socket.on('chatMessage', (msg) => {
        const username = users[socket.id] || `User_${socket.id.slice(0, 4)}`;
        io.emit('chatMessage', { username, msg, id: socket.id });
    });

    // Typing indicator
    socket.on('typing', () => {
        const username = users[socket.id] || `User_${socket.id.slice(0, 4)}`;
        socket.broadcast.emit( 'typing', username);
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users[socket.id] || `User_${socket.id.slice(0, 4)}`;
        delete users[socket.id];
        io.emit('userDisconneted', `${username} left the chat`);
        console.log('User disconnect:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});