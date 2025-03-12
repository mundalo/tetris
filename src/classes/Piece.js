import { getTetriminos } from './Tetriminos'

export const generatePiece = () => {
    const number = Math.floor(Math.random() * 7) + 1;
    const tetrimino = getTetriminos(number);

    return tetrimino;
}
