const socket = io();
let player1 = null;

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', e => {
    socket.emit('try-move', e.target.dataset.col);
}));

socket.on('connect', () => {
    const room = window.location.href.split("/");
    socket.emit('join', room[room.length - 1]);
});

socket.on('start', startPlayer => {
    setStatus(startPlayer === socket.id ? 'You start!' : 'Opponent starts!');
    player1 = startPlayer;
});

socket.on('move', (player, row, col) => {
    console.log(`Player ${player} went`);
    console.log(col);
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`)
    if (player1 === player) {
        cell.classList.add('red');
    } else {
        cell.classList.add('blue');
    }
    setStatus(player === socket.id ? "Opponent's turn!" : 'Your turn!'); //logic flips on turn change
});

socket.on('win', winner => {
    setStatus(winner === socket.id ? 'You win!' : 'You lose!')
});

const setStatus = text => {
    document.querySelector('.status').textContent = text;
}