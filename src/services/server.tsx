const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');

const privateKey = fs.readFileSync('./server.key', 'utf8');
const certificate = fs.readFileSync('./server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

// Serve static files (React app)
app.use(express.static(path.join(__dirname, '../../build')));

const server = https.createServer(credentials, app);
const io = socketIo(server, {
    cors: {
        origin: "https://localhost:8001",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    },
    transports: ['websocket'],
});

let rooms = {};

io.on('connection', (socket) => {
    console.log("a user connected ", socket.id);

    socket.on('join-room', ({ room, playerName }) => {
        if (rooms[room]?.players.includes(playerName)) {
            socket.emit('error', 'Player name must be unique! Please choose another name.');
            return;
        }
        console.log(`${playerName} joined room ${room}.`);

        if (!rooms[room]) {
            rooms[room] = { players: [], startPlayer: null };
        }

        rooms[room].players.push(playerName);

        if (rooms[room].players.length === 1) {
            rooms[room].startPlayer = playerName;
        }

        console.log(`${playerName} joined room ${room}.`);
        socket.join(room);

        io.to(room).emit('room-info', {
            players: rooms[room].players,
            startPlayer: rooms[room].startPlayer
        });

        console.log(`${playerName} joined room ${room}`);
    });

    socket.on('start-game', (room) => {
        const startPlayer = rooms[room]?.startPlayer;
        if (startPlayer && socket.id === startPlayer) {
            console.log("Game started in room: ", room);
            io.to(room).emit('game-started');
        } else {
            socket.emit('error', 'Only the first player can start the game');
        }
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id);
    });
});

// Fallback route for all non-API requests (to handle React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

server.listen(8000, () => {
    console.log('Server is running on https://localhost:8000');
});
