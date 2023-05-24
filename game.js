module.exports = class Game {
    constructor(player1) {
        this.player1 = player1;
        this.player2 = null;
        this.turnPlayer = player1;
        this.board = Array(6).fill().map(() => Array(7).fill(0));
    }

    addOpponent(player2) {
        this.player2 = player2;
    }

    canDropPiece(player, col) {
        return player === this.turnPlayer && this.board[0][col] === 0;
    }

    getOpenRowForCol(col) {
        for (let row = this.board.length - 1; row >= 0; row--) {
            if (this.board[row][col] === 0) {
                return row;
            }
        }
        return -1;
    }

    dropPiece(player, col) {
        this.board[this.getOpenRowForCol(col)][col] = this.getPieceForPlayer(player);

        //next turn player
        if (this.turnPlayer === this.player1) {
            this.turnPlayer = this.player2;
        } else {
            this.turnPlayer = this.player1;
        }
    }

    getPieceForPlayer(player) {
        if (player === this.player1) {
            return 1;
        } else {
            return -1;
        }
    }

    won(player) {
        const winSum = this.getPieceForPlayer(player) * 4;

        for (let r = this.board.length - 1; r >= 0; r--) {
            for (let c = 0; c < this.board[r].length; c++) {
                if (this.board[r][c] === 0) continue;
                //Check up
                if (r - 3 >= 0) { //if theres 3 more slots up
                    if (this.board[r][c] + this.board[r - 1][c]+ this.board[r - 2][c] + this.board[r - 3][c] === winSum) {
                        return true;
                    }
                }
                if (c + 3 < this.board[r].length) { //if theres 3 more slots to right
                    //Check right
                    if (this.board[r][c] + this.board[r][c + 1] + this.board[r][c + 2] + this.board[r][c + 3] === winSum) {
                        return true;
                    }
                    //Check diag up right
                    if (r - 3 >= 0) {
                        if (this.board[r][c] + this.board[r - 1][c + 1] + this.board[r - 2][c + 2] + this.board[r - 3][c + 3] === winSum) {
                            return true;
                        }
                    }
                    //Check diag down right
                    if (r + 3 < this.board.length) {
                        if (this.board[r][c] + this.board[r + 1][c + 1] + this.board[r + 2][c + 2] + this.board[r + 3][c + 3].val === winSum) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

