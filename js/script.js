const socket = io();
let player1 = null;

socket.on('connect', () => {
    const room = window.location.href.split("/");
    socket.emit('join', room[room.length - 1]);
});

socket.on('start', startPlayer => {
    clearBoard();
    if (startPlayer === socket.id) {
        document.querySelector(".player1").classList.add("active");
        document.querySelector(".player1 > .piece-icon").className = "piece-icon red";
        document.querySelector(".player2 > .piece-icon").className = "piece-icon blue";
    } else {
        document.querySelector(".player2").classList.add("active");
        document.querySelector(".player1 > .piece-icon").className = "piece-icon blue";
        document.querySelector(".player2 > .piece-icon").className = "piece-icon red";
    }
    setStatus(startPlayer === socket.id ? 'You start!' : 'Opponent starts!');
    player1 = startPlayer;
});

//Handle moves
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', e => {
    socket.emit('try-move', e.target.dataset.col ? e.target.dataset.col : e.target.parentElement.dataset.col);
}));
socket.on('move', (player, row, col) => {
    setStatus("‎"); //invisible space for now
    const piece = document.querySelector(`.cell[data-row='${row}'][data-col='${col}'] > .piece`)
    if (player1 === player) {
        piece.classList.add('red');
    } else {
        piece.classList.add('blue');
    }
    toggleTurn();
});

//Handle game ends
socket.on('win', winner => {
    setStatus(winner === socket.id ? 'You win!' : 'You lose!');
    document.querySelector(".player1").classList.remove("active");
    document.querySelector(".player2").classList.remove("active");
    document.querySelector(".rematch").style.display = "block";
});
socket.on('tie', () => {
    setStatus('Tie!');
    document.querySelector(".player1").classList.remove("active");
    document.querySelector(".player2").classList.remove("active");
    document.querySelector(".rematch").style.display = "block";
});
socket.on('cancel', () => {
    setStatus("Opponent disconnected. Game cancelled.");
})

//Handle rematches
document.querySelector('button.rematch').addEventListener('click', e => {
    document.querySelector(".rematch").style.display = "none";
    socket.emit('request-rematch', socket.id);
    setStatus("Rematch requested.")
});
socket.on('rematch-requested', requester => {
    if (requester !== socket.id) {
        setStatus("Opponent wants to play again! Rematch?");
    }
})

function setStatus(text) {
    document.querySelector('.status').textContent = text;
}

function toggleTurn() {
    document.querySelector(".player1").classList.toggle("active");
    document.querySelector(".player2").classList.toggle("active");
}

function clearBoard() {
    document.querySelectorAll(".piece").forEach(piece => piece.className = "piece"); //remove potential red or blue classes;
}