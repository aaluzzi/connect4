const socket = io();
let player1 = null;

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', e => {
    socket.emit('try-move', e.target.dataset.col);
}));
document.querySelectorAll('.piece').forEach(cell => cell.addEventListener('click', e => {
    socket.emit('try-move', e.target.parentElement.dataset.col);
}));

socket.on('connect', () => {
    const room = window.location.href.split("/");
    socket.emit('join', room[room.length - 1]);
});

socket.on('start', startPlayer => {
    if (startPlayer === socket.id) {
        document.querySelector(".player1").classList.add("active");
    } else {
        document.querySelector(".player2").classList.add("active");
    }
    setStatus(startPlayer === socket.id ? 'You start!' : 'Opponent starts!');
    player1 = startPlayer;
});

socket.on('move', (player, row, col) => {
    setStatus(" ");
    const piece = document.querySelector(`.cell[data-row='${row}'][data-col='${col}'] > .piece`)
    if (player1 === player) {
        piece.classList.add('red');
    } else {
        piece.classList.add('blue');
    }
    toggleTurn();
});

socket.on('win', winner => {
    setStatus(winner === socket.id ? 'You win!' : 'You lose!')
});

const setStatus = text => {
    document.querySelector('.status').textContent = text;
}

function toggleTurn() {
    document.querySelector(".player1").classList.toggle("active");
    document.querySelector(".player2").classList.toggle("active");
}