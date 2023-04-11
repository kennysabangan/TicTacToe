import { useEffect, useState } from 'react';
import { wait } from '../utils/util';
import './board.css';
import title from '../assets/title.png'
import X_img from '../assets/x.png';
import O_img from '../assets/o.png';
import {
    X,
    O,
    EMPTY,
    initialState,
    player,
    terminal,
    actions,
    BoardState,
    findWinner,
    minimax,
    Pair
} from '../utils/tictactoe';
import Tile from './tile';

// Preload the images
const xImg = new Image();
xImg.src = X_img;
const oImg = new Image();
oImg.src = O_img;

// Constants
const EASY: string = "EASY";
const MEDIUM: string = "MEDIUM";
const HARD: string = "HARD";
const PVP: string = "PVP";

type Mode = typeof EASY | typeof MEDIUM | typeof HARD | typeof PVP | null;

const Board = () => {
    const [gameOn, setGameOn] = useState(false);
    const [modeSelected, setModeSelected] = useState<Mode>(null);
    const [board, setBoard] = useState(initialState());
    const [winner, setWinner] = useState<string | null>(null);
    const [display, setDisplay] = useState("'s Turn");
    const [isGameOver, setIsGameOver] = useState(false);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isAiTurn, setIsAiTurn] = useState(false);

    function game(location: Pair | null) {
        // If game is over or one clicks in an invalid location, stop playing
        if (isGameOver || !location || isAiThinking) return;

        // If it's not the player's turn, don't play
        if (player(board) === X && isAiTurn) return;

        // In PVE: If player just played, it's now the AI's turn
        if (modeSelected !== PVP && !isAiTurn) {
            setIsAiTurn(true);
        }

        // Check for available, valid tiles
        const availableActions = actions(board);
        const isTileAvailable = availableActions.some((action) => JSON.stringify(action) === JSON.stringify(location));

        // If location is not available, do nothing
        if (!isTileAvailable) return;

        // If location is available, update board
        const newBoard =  board.map((row) => [...row]);
        const nextPersonPlaying = player(newBoard)?.slice();
        newBoard[location[0]][location[1]] = player(newBoard);
        setBoard(newBoard);

        // Check if player just made a terminal move
        if (terminal(newBoard)) {
            setIsGameOver(true);
            if (findWinner(newBoard) === null) {
                setDisplay("It's a tie!");
                return;
            }
            setWinner(nextPersonPlaying as string);
            setDisplay("is the winner!");
        }
    }

    function restartGame() {
        setBoard(initialState());
        setWinner(null);
        setDisplay("'s Turn");
        setIsGameOver(false);
    }

    function resetMode() {
        setModeSelected(null);
    }

    function selectMode(e: React.MouseEvent<HTMLButtonElement>) {
        restartGame();
        setModeSelected((e.target as HTMLButtonElement).value);
    }

    function moveAi() {
        let aiMove: Pair | null = actions(board)[0];
            switch (modeSelected) {
                // EASY: 45% CHANCE OF CHOSING THE MOST OPTIMAL MOVE
                case EASY:
                    if (Math.random() < 0.55) {
                        aiMove = actions(board)[Math.floor(Math.random() * actions(board).length)];
                    } else {
                        aiMove = minimax(board);
                    }
                    break;
                // MEDIUM: 70% CHANCE OF CHOOSING THE MOST OPTIMAL MOVE
                case MEDIUM:
                    if (Math.random() < 0.30) {
                        aiMove = actions(board)[Math.floor(Math.random() * actions(board).length)];
                    } else {
                        aiMove = minimax(board);
                    }
                    break;
                // HARD / IMPOSSIBLE: 92% CHANCE OF CHOOSING THE MOST OPTIMAL MOVE
                case HARD:
                    if (Math.random() < 0.08) {
                        aiMove = actions(board)[Math.floor(Math.random() * actions(board).length)];
                    } else {
                        aiMove = minimax(board);
                    }
                    break;
                default:
                    aiMove = minimax(board)
                    break;
            }
            // "Thinking time" for computer
            const minThinkingTime = 400;
            const thinkingTime = Math.max(Math.random() * 1000, minThinkingTime);
            playAfterAIThinks(thinkingTime, aiMove);
    }

    async function playAfterAIThinks(thinkTime: number, aiMove: Pair | null) {
        setIsAiThinking(true);
        await wait(thinkTime);
        game(aiMove);
        setIsAiThinking(false);
        setIsAiTurn(false);
    }

    useEffect(() => {
        if (isAiTurn) {
            moveAi();
        }

        if (!modeSelected) {
            setGameOn(false);
        } else {
            setGameOn(true);
        }
    }, [isAiTurn, modeSelected])

    return (
    <>
        <img src={title} className="title-img"/>
        <div className="board">
            { gameOn ? board.map((row, rowIdx) => (
                <div key={rowIdx}>
                    {row.map((tileVal, tileIdx) => {
                        return (
                            <Tile key={`${rowIdx}, ${tileIdx}`} value={tileVal} location={[rowIdx, tileIdx]} onClick={() => game([rowIdx, tileIdx])}/>
                        )
                    })}
                </div>
            )) :
             <div className="select-mode">
                <h1>1-Player Game</h1>
                <button className="mode-btn" value="EASY" onClick={selectMode}>Easy</button>
                <button className="mode-btn" value="MEDIUM" onClick={selectMode}>Medium</button>
                <button className="mode-btn" value="IMPOSSIBLE" onClick={selectMode}>Impossible</button>
                <h1 style={{ marginTop: "10px" }}>2-Player Game</h1>
                <button className="mode-btn" value="PVP" onClick={selectMode}>Play Against a Friend</button>
             </div>
            }
        </div>
        { gameOn &&
            <div className="game-display">
                { !winner && player(board) === X &&
                    <img src={xImg.src} alt="X" height="50px" className="player-img"/>
                }
                { !winner && player(board) === O &&
                    <img src={oImg.src} alt="O" height="50px" className="player-img"/>
                }
                { winner === X &&
                    <img src={xImg.src} alt="X" height="50px" className="player-img"/>
                }
                { winner === O &&
                    <img src={oImg.src} alt="O" height="50px" className="player-img"/>
                }
                <span className="display-text">{display}</span>
            </div>
        }
        { gameOn &&
            <button className="main-menu-btn" onClick={resetMode}>Main Menu</button>
        }
        { gameOn &&
            <button className="play-again-btn" hidden={!isGameOver} onClick={restartGame}>Play Again?</button>
        }
    </>
    )
}

export default Board;