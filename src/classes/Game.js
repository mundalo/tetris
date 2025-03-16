import React, { useState } from 'react';
import Player from './Player';
import Controls from './Controls';
import { useQueueContext } from './PieceQueue';
import { getPieceColor } from './Piece';

export const Game = () => {
    const { getPiece } = useQueueContext();
    const [gameState, setGameState] = useState("Start");
    var players = 2;
    var rotate = 0;

    const isPieceWithinBoundary = (piece, x, y, grid) => {
        let n = 10 - 4;
        let k = x + (y * 10);

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1 && 
                    (k % 10 === 0 || k > 200 || 
                    grid[k].classList.contains("blocked") || 
                    grid[k].getAttribute("piece") !== "piece-0"
                )) {
                    return false;
                }
                k++;
            }
            k += n;
        }
        return true;
    }

    const putPiece = (piece, x, y, grid) => {
        let n = 10 - 4;
        let k = x + (y * 10);

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    grid[k].style.backgroundColor = getPieceColor(grid[k].getAttribute("piece"));
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

                    grid[k].style.backgroundColor = getPieceColor("piece-0");
                }
                k++;
            }
            k += n;
        }
    }

    const replacePiece = (currentPiece, color, x, y, grid, player, pieceIndex) => {
        removePiece(currentPiece[rotate - 1], getPieceColor(0), x - 1, y - 1, grid);
        putPiece(currentPiece[rotate], color, x, y, grid);
        player.setAttribute("piece_index", pieceIndex + 1);
    }

    const movePiece = (i, moveX = 0) => {
        const container = document.getElementsByClassName("container-of-player-" + i);
        const player = document.getElementsByClassName("player-grid-" + i);
        const pieceIndex = Number(player[0].getAttribute("piece_index"));
        const piece = getPiece(pieceIndex);
        const currentPiece = piece[0][rotate];
        const color = piece[1];

        console.log("currentPiece: ", currentPiece);
        if (container[0]) {
            const grid = container[0].getElementsByClassName("grid-item");
            const x = Number(player[0].getAttribute("x")) + moveX;
            const y = Number(player[0].getAttribute("y"));

            if (isPieceWithinBoundary(currentPiece, x, y, grid)) {
                console.log("piece is within boundary put piece x", x, "y ", y);
                replacePiece(currentPiece, color, x, y, grid, player[0], pieceIndex);
                // needs to be set into a timer that changes each second player[0].setAttribute("y", y + 1);
            } else {
                console.log("piece is not within boundary, do not put piece");
            }
        }
    }

    const startGame = () => {
        updateStateText("Pause")

        for (let i = 1; i <= players; i++) {
            movePiece(i);
        }
    }

    const updateStateText = (state) => {
        const button = document.getElementById("state_btn");

        button.innerHTML = state;
        setGameState(state);
    }

    const changeGameState = () => {    
        if (gameState === "Start" || gameState === "Resume") {
            startGame();
        } else if (gameState === "Pause") {
            updateStateText("Resume");
        } else if (gameState === "End") {
            updateStateText("Start");
        }
    };

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
        <div className="App" onKeyDown={(e) => handleKeyPress(e)}>
            <header className="App-header">
                <p>Tetris</p>
            </header>
            <div className="board">
                <h1>Tetris</h1>
                <Controls />
                <button id="state_btn" onClick={changeGameState}>Start</button>
                <div className="grid-parent-container"> 
                    <Player player="1" />
                    <Player player="2" />
                </div>
            </div>
        </div>
    );
}
