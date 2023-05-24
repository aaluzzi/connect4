const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

server.listen(3000, () => {
    console.log('listening on *:3000');
});

const path = require('path');
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/:room", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const Game = require('./game');

const games = {}

io.on('connection', (socket) => {
    
    socket.on('join', (room) => {
        console.log("room " + room);
        socket.join(room);
        socket.room = room;

        if (room in games) {
            //someone joined
            games[room].addOpponent(socket.id);
            io.to(socket.room).emit('start', games[room].player1);
        } else {
            //initial player
            games[room] = new Game(socket.id);
            console.log(games[room].board);
        }
    })

    socket.on('try-move', (col) => {
        console.log(socket.id + " trying to place at " + col);

        if (games[socket.room]?.player2 && games[socket.room].canDropPiece(socket.id, col)) {
            games[socket.room].dropPiece(socket.id, col);
            io.to(socket.room).emit("move", socket.id, col);

            if (games[socket.room].won(socket.id)) {
                io.to(socket.room).emit("win", socket.id);
                delete games[socket.room];
            }
        }

    })
})