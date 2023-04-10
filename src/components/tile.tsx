import { MouseEventHandler } from "react";
import { X, O, EMPTY } from "../utils/tictactoe";
import X_img from '../assets/x.png';
import O_img from '../assets/o.png';

type TileProps = {
    value: string | null;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Tile({ value, onClick }: TileProps) {
    return (
        <button
            className={`tile ${value === EMPTY ? 'empty' : ''}`}
            onClick={onClick}>
            {value === X ? <img src={X_img} alt="X" className="tile-img"/> : null}
            {value === O ? <img src={O_img} alt="O" className="tile-img"/> : null}
        </button>
    )
};