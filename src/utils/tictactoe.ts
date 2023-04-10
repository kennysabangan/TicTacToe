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

    // TODO: If board is terminal, return null
    // if terminal(board):

    if (x_count > o_count) {
        return O;
    } else {
        return X;
    }
}

// Returns set of all possible actions (i, j) available
export function actions(board: BoardState): Set<Pair> {
    const availableActions = new Set<Pair>();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == EMPTY) {
                availableActions.add([i, j]);
            }
        }
    }
    return availableActions;
}