export const EMPTY: null = null;
export const X: string = "X";
export const O: string = "O";

export type BoardState = Array<Array<string | null>>;
export type Pair = [number, number];

// Returns the starting state of the board
export function initialState(): BoardState {
    return [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]
    ]
}

// Returns the player who has the next turn on the board
export function player(board: BoardState): string | null {
    if (terminal(board)) return null;

    let x_count = 0;
    let o_count = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == X) {
                x_count++;
            } else if (board[i][j] == O) {
                o_count++;
            }
        }
    }

    if (x_count > o_count) {
        return O;
    } else {
        return X;
    }
}

// Returns set of all possible actions (i, j) available
export function actions(board: BoardState): Pair[] {
    const availableActions: Pair[] = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == EMPTY) {
                availableActions.push([i, j] as Pair);
            }
        }
    }
    return availableActions;
}

// Returns the board that results from making the move (i, j) on the board
export function result(board: BoardState, action: Pair) {
    let newBoard = JSON.parse(JSON.stringify(board));
    newBoard[action[0]][action[1]] = player(board);
    return newBoard;
}

// Returns the winner of the game, if there is one
export function findWinner(board: BoardState) {

    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] != null) {
            return board[i][0];
        }
    }

    // Check for a column winner
    for (let j = 0; j < 3; j++) {
        if (board[0][j] === board[1][j] && board[1][j] === board[2][j] && board[0][j] != null) {
            return board[0][j];
        }
    }

    // Check for a diagonal winner
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] != null) {
        return board[0][0];
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] != null) {
        return board[0][2];
    }

    return null;
}


// Returns true if game is over, false otherwise
export function terminal(board: BoardState) {
    if (findWinner(board) != null) {
        return true;
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == EMPTY) {
                return false;
            }
        }
    }

    return true;
}

// Returns the optimal action for the current player on the board
export function minimax(board: BoardState): null | Pair {
    if (terminal(board)) {
        return null;
    }

    let bestMove: Pair | null = null;
    let alpha = -Infinity;
    let beta = Infinity;

    if (player(board) == X) {
        let v = -Infinity;
        for (let action of actions(board)) {
            let minVal = minValue(result(board, action), alpha, beta);
            if (minVal > v) {
                v = minVal;
                bestMove = action;
            }
        }
    } else {
        let v = Infinity;
        for (let action of actions(board)) {
            let maxVal = maxValue(result(board, action), alpha, beta);
            if (maxVal < v) {
                v = maxVal;
                bestMove = action;
            }
        }
    }

    return bestMove;
}

// Returns 1 if X won the game, -1 if O has won, 0 if there's a tie
export function utility(board: BoardState) {
    let winner = findWinner(board);
    if (winner == X) {
        return 1;
    } else if (winner == O) {
        return -1;
    } else {
        return 0;
    }
}

function maxValue(board: BoardState, alpha: number, beta: number) {
    if (terminal(board)) {
        return utility(board);
    }

    let v = -Infinity;
    for (let action of actions(board)) {
        v = Math.max(v, minValue(result(board, action), alpha, beta));
        if (v >= beta) {
            return v;
        }
        alpha = Math.max(alpha, v);
    }
    return v;
}

function minValue(board: BoardState, alpha: number, beta: number) {
    if (terminal(board)) {
        return utility(board);
    }

    let v = Infinity;
    for (let action of actions(board)) {
        v = Math.min(v, maxValue(result(board, action), alpha, beta));
        if (v <= alpha) {
            return v;
        }
        beta = Math.min(beta, v);
    }
    return v;
}