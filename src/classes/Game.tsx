import React, { /*useState,*/ useEffect } from 'react';
import Player from './Player';
import { useQueueContext } from './PieceQueue';
import { getPieceColor } from './Piece';
//import socketServiceInstance from '../services/service';

interface GameProps {
    gameState: string;
    playerName: string;
    room: string;
}

export const Game: React.FC<GameProps> = ({ gameState, playerName, room }) => {
    const { getPiece } = useQueueContext();
    //var players = 2;
    var rotate = 0;
    enum Piece_indx {
        coordinates,
        nbr
    };

    useEffect(() => {
        /*const updateStateText = (state) => {
            const button = document.getElementById("state_btn");
            button.innerHTML = state;
        }
        
        console.log(`GameStarted updated to: ${gameStarted}`);
        const button = document.getElementById("state_btn");
        if (gameStarted === true) {
            if (button.innerHTML === "Start Game" || button.innerHTML === "Resume") {
                updateStateText("Pause");
            }
        } else if (gameStarted === false) {
            if (button.innerHTML !== "Start Game") {
                updateStateText("Resume");
            }
        } *//*else if (gameStarted === true) {
            updateStateText("Start");
        }*/
        /*socketServiceInstance.connect(room, playerName);

        return () => {
            socketServiceInstance.disconnect();
        };*/
    }, [gameState, room, playerName]);

    const isPieceWithinBoundary = (piece, x, y, grid) => {
        let n = 10 - 4;
        let k = x + (y * 10);

        for (let i = 0; i < piece[rotate][Piece_indx.coordinates].length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    console.log("Piece at i: ", i, " j: ", j, " === 1");
                    if (k % 10 === 0 || k > 200) {
                        console.log("k: ", k, " is not within valid bounds");
                        return false;
                    }
                    if (grid[k].classList.contains("blocked")) {
                        console.log("current placement is blocked k: ", k);
                        return false;
                    }
                    if (Number(grid[k].getAttribute("data-piece")) !== 0) {
                        console.log("k: ", k, "does not contain data piece 0 but contains  [", grid[k].getAttribute("data-piece"), "]");
                        return false;
                    }
                }
                k++;
            }
            k += n;
        }
        return true;
    }

    const putPiece = (piece, color, x, y, grid) => {
        let n = 10 - 4;
        let k = x + (y * 10);

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {

                    grid[k].style.backgroundColor = getPieceColor(color);
                }
                k++;
            }
            k += n;
        }
    }

    const removePiece = (piece, x, y, grid) => {
        let n = 10 - 4;
        let k = x + (y * 10);

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {

                    grid[k].style.backgroundColor = getPieceColor(0);
                }
                k++;
            }
            k += n;
        }
    }

    const replacePiece = (currentPiece, color, x, y, grid) => {
        if (y > 0) {
            removePiece(currentPiece[rotate - 1], x - 1, y - 1, grid);
        }
        putPiece(currentPiece[rotate], color, x, y, grid);
    }

    /*const setPieceAsBlocked = (currentPiece, x, y, grid) => {
        let n = 10 - 4;
        let k = x + (y * 10);

        for (let i = 0; i < currentPiece[rotate].length; i++) {
            for (let j = 0; j < currentPiece[rotate][i].length; j++) {
                if (currentPiece[rotate][i][j] === 1) {
                    grid[k].classList.add("blocked");
                }
                k++;
            }
            k += n;
        }
    }
*/
    const movePiece = (i, moveX = 0) => {
        const container = document.getElementsByClassName("container-of-player-" + i);
        const player = document.getElementsByClassName("player-grid-" + i);
        const pieceIndex = Number(player[0].getAttribute("piece_index"));
        const piece = getPiece(pieceIndex);
        const currentPiece = piece.tetrimino;
        const color = piece.type;

        console.log("currentPiece: ", currentPiece);
        if (container[0]) {
            const grid = container[0].getElementsByClassName("grid-item");
            const x = Number(player[0].getAttribute("data-x")) + moveX;
            const y = Number(player[0].getAttribute("data-y"));
            console.log("x: ", x, "y: ", y);

            if (isPieceWithinBoundary(currentPiece, x, y, grid)) {
                console.log("piece is within boundary put piece x", x, "y ", y);
                replacePiece(currentPiece, color, x, y, grid);
                // needs to be set into a timer that changes each second player[0].setAttribute("y", y + 1);
                return true;
            } else {
                // if player reached bottom of board (cannot move further down change active piece of player)
                return false;
                    
    
            }
        }
    }

    /*const startGame = () => {
        //socketServiceInstance.emit('start-game', { playerName });
        updateStateText("Pause")

        for (let i = 1; i <= players; i++) {
            if (!movePiece(i)) {
                console.log("could not move piece further down. Sets the piece as blocked and picks new piece for player");
                const container = document.getElementsByClassName("container-of-player-" + i);
                const player = document.getElementsByClassName("player-grid-" + i);
                const pieceIndex = Number(player[0].getAttribute("piece_index"));
                const piece = getPiece(pieceIndex);
                const currentPiece = piece.tetrimino;
                if (container[0]) {
                    const grid = container[0].getElementsByClassName("grid-item");
                    const x = Number(player[0].getAttribute("data-x"));
                    const y = Number(player[0].getAttribute("data-y"));
                    console.log("x: ", x, "y: ", y);
                    setPieceAsBlocked(currentPiece, x, y, grid);
                    const newPieceIndex = pieceIndex + 1
                    player[0].setAttribute("piece_index", String(newPieceIndex));
                }
            }
        }
    }*/

    const handleKeyPress = (e) => {
        console.log( "You pressed a key: ", e.keyCode );
        if (e.keyCode === 37) {
            console.log("left 37 - move piece left");
            movePiece(1, -1);
        } else if (e.keyCode === 38) {
            rotate = rotate + 1 === 4 ? 0 : rotate + 1;
            console.log(" up 38 - rotate clockwise rotation: ", rotate);
            movePiece(1);
        } else if (e.keyCode === 39) {
            console.log("right 39 - move piece right");
            movePiece(1, 1);
        } else if (e.keyCode === 40) {
            console.log("down 40");
            // make timer faster?
        } else if (e.keyCode === 32) {
            console.log("space 32");
            // move piece to bottom
        }
    }

    return (
        <div className="App" onKeyDown={(e) => handleKeyPress(e)} tabIndex={0}>
            <div className="board">
                <div className="grid-parent-container"> 
                    <Player player={playerName} />
                </div>
            </div>
        </div>
    );
}
