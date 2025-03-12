import React, { useState } from 'react';
import Player from './Player';
import Controls from './Controls';
//import { useQueueContext } from './PieceQueue';

export const Game = () => {
    //const { getPiece } = useQueueContext();
    const [gameState, setGameState] = useState("Start");
    var players = 2;

    const putPiece = (piece, x, y, grid) => {
        let j = 0;
        for (let i = 0; i < piece.length; i++) {
            if (piece[i] === 1) {
                grid[j].style.backgroundColor = "blue";
            }
            j++;
        }
        for (let j = 0; j < grid.length; j++) {
            //grid[j].style.backgroundColor = "blue";
            //if (j % 2 === 0) {
            //    grid[j].className = grid[j].className + " blocked";
                //console.log("contains: " + grid[j].classList.contains("blocked"));
            //} else {
                //grid[j].style.backgroundColor = "blue";
                //console.log("contains: " + grid[j].classList.contains("blocked"));
            //}
            
        }
    }

    const startGame = () => {
        updateStateText("Pause")

        for (let i = 1; i <= players; i++) {
            const container = document.getElementsByClassName("container-of-player-" + i);
            console.log("player-grid-" + i);
            const player = document.getElementsByClassName("player-grid-" + i);
            const currentPiece = player[0].getAttribute("piece_index");
            console.log("player: ", player[0].getAttribute("piece_index"), player[0].getAttribute("player"));
            // getPiece()
            if (container[0]) {
                const grid = container[0].getElementsByClassName("grid-item");
                putPiece(currentPiece[0], 0, 0, grid);
            }
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

    return (
        <div className="App">
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
