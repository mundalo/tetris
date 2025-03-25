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

    socket.on('start-game', ({ room, playerName }) => {
        const startPlayer = rooms[room]?.startPlayer;
        if (startPlayer === playerName) {
            console.log("Game started in room: ", room);
            io.to(room).emit('game-started');
        } else {
            socket.emit('error', 'Only the first player can start the game');
        }
    });

    socket.on('player-disconnect', ({ room, playerName }) => {
        console.log("player-disconnect ", playerName, "disconnect from room", room);
        
        if (rooms[room]?.players?.includes(playerName)) {
            console.log("Removing player from room:", playerName);
            console.log("old room: ", rooms[room]);
            rooms[room].players = rooms[room].players.filter(player => player != playerName);
            if (rooms[room].startPlayer === playerName) {
                console.log("players length: ", rooms[room].players.length);
                if (rooms[room].players.length > 0) {
                    rooms[room].startPlayer = rooms[room].players[0];
                    console.log("new startPlayer selected");
                } else {
                    rooms[room].startPlayer = null;
                }
            }
            console.log("new room: ", rooms[room]);
            io.to(room).emit('room-info', {
                players: rooms[room].players,
                startPlayer: rooms[room].startPlayer
            });
            console.log(`${playerName} left room ${room}.`);
        } else {
            console.log(`${playerName} not found in room ${room}`);
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
