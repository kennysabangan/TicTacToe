import React, { useState, useEffect } from 'react';
import '../assets/styles/board.css';
import X_img from '../assets/x.png';
import O_img from '../assets/o.png';
import {
    X,
    O,
    EMPTY,
    initialState,
    player,
    actions,
    BoardState
} from '../utils/tictactoe';
import { Pair } from '../utils/tictactoe';
import Tile from './tile';

const Board = () => {
    const [board, setBoard] = useState(initialState());

    if (player(board) === X) {
        console.log("X's turn");
        setBoard([
            [X, O, X],
            [O, X, O],
            [X, O, X]
        ])
        // setBoard([
        //     [EMPTY, EMPTY, EMPTY],
        //     [EMPTY, EMPTY, EMPTY],
        //     [EMPTY, EMPTY, EMPTY]
        // ])
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [])

    function handleClick(e: React.MouseEvent) {
        console.log("clicked");
    }

    return (
        <div className="board">
            { board.map((row, rowIdx) => (
                <div key={rowIdx}>
                    {row.map((tile, tileIdx) => (
                        <Tile key={`${rowIdx}, ${tileIdx}`} value={tile} onClick={handleClick}/>
                    ))}
                </div>
            )) }
        </div>
    )
}

export default Board;