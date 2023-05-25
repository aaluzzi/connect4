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

function generateRoom() {
    let allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let room = '';
	for(let i = 0; i < 5; i++) {
		room += allChars.charAt(Math.floor(Math.random() * allChars.length));
	}
	return room;
}

app.get("/", (req, res) => {
    res.redirect(generateRoom());
});

app.get("/:room([A-Za-z0-9]{5})", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const Game = require('./game');

const games = {}

io.on('connection', (socket) => {
    
    socket.on('join', (room) => {
        console.log(socket.id + " is joining room " + room);
        socket.join(room);
        socket.room = room;

        if (room in games) {
            //someone joined, make sure they are the second player
            //TODO proper spectating? (currently just blocks other players)
            if (!games[room].player2) {
                games[room].addOpponent(socket.id);
                console.log("game starting in room " + room);
                io.to(socket.room).emit('start', games[room].player1);
            }
        } else {
            //initial player
            games[room] = new Game(socket.id);
        }
    })

    socket.on('disconnect', () => {
        if (games[socket.room]) {
            delete games[socket.room];
            io.to(socket.room).emit("cancel", socket.id);
        }
    });

    socket.on('try-move', (col) => {
        console.log(socket.id + " is trying to place at " + col);

        if (games[socket.room]?.player2 && games[socket.room].canDropPiece(socket.id, col)) {
            let row = games[socket.room].getOpenRowForCol(col);
            games[socket.room].dropPiece(socket.id, col);
            io.to(socket.room).emit("move", socket.id, row, col);

            if (games[socket.room].won(socket.id)) {
                delete games[socket.room];
                console.log("game won in room " + socket.room);
                io.to(socket.room).emit("win", socket.id);
            }
        }

    })
})