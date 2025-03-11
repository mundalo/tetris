import { getTetriminos } from './Tetriminos'

export const generatePiece = () => {
    const number = Math.floor(Math.random() * 7) + 1;
    console.log("number: " + number);
    const tetrimino = getTetriminos(number);

    console.log("tetrimono: " + tetrimino);
    return tetrimino;
}
