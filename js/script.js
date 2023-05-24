const socket = io();
let player1 = null;

document.querySelectorAll(".column").forEach(column => column.addEventListener('click', e => {
    socket.emit('try-move', e.target.dataset.col);
}));

socket.on("connect", () => {
    socket.emit("join", window.location.href);
});

socket.on('start', startPlayer => {
    setStatus(startPlayer === socket.id ? "You start!" : "Opponent starts!");
    player1 = startPlayer;
});

socket.on('move', (player, col) => {
    console.log(`Player ${player} went`);
    console.log(col);
    const piece = document.createElement("div");
    piece.classList.add("piece");
    if (player1 === player) {
        piece.classList.add("red");
    } else {
        piece.classList.add("blue");
    }
    document.querySelector(`[data-col="${col}"]`).appendChild(piece);
    setStatus(player === socket.id ? "Opponent's turn!" : "Your turn!"); //logic flips on turn change
});

socket.on('win', winner => {
    setStatus(winner === socket.id ? "You win!" : "You lose!")
});

const setStatus = text => {
    document.querySelector(".status").textContent = text;
}