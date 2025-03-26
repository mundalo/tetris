import React, { /*useState,*/ useEffect, useRef } from 'react';
import Player from './Player';
import { useQueueContext } from './PieceQueue';
import { Piece, getPieceColor } from './Piece';
//import socketServiceInstance from '../services/service';

interface GameProps {
    gameState: string;
    playerName: string;
    room: string;
}

interface PlayerInfo {
    container: Element;
    rotation: number;
    pieceIndx: number;
    piece: Piece;
    x: number;
    y: number;
    getPiece: (i: number) => Piece | null;
}

class GameLogic {
    playerInfo: PlayerInfo;

    constructor(playerInfo: PlayerInfo) {
        this.playerInfo = playerInfo; 
    }

    isPieceWithinBoundary(piece: Piece["tetrimino"], x: number, y: number, grid) {
        let n = 10 - 4;
        let k = x + (y * 10);

        console.log("select piece: ", piece[this.playerInfo.rotation]);
        for (let i = 0; i < piece[this.playerInfo.rotation].length; i++) {
            for (let j = 0; j < piece[this.playerInfo.rotation][i].length; j++) {
                if (piece[this.playerInfo.rotation][i][j] === 1) {
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

    putPiece(piece, color: Piece["type"], x: number, y: number, grid) {
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

    removePiece(piece, x: number, y: number, grid) {
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

    replacePiece(currentPiece: Piece["tetrimino"], color: Piece["type"], x: number, y: number, grid) {
        if (y > 0) {
            this.removePiece(currentPiece[this.playerInfo.rotation - 1], x - 1, y - 1, grid);
        }
        this.putPiece(currentPiece[this.playerInfo.rotation], color, x, y, grid);
    }

    setPieceAsBlocked(currentPiece: Piece["tetrimino"], x: number, y: number, grid) {
        let n = 10 - 4;
        let k = x + (y * 10);

        for (let i = 0; i < currentPiece[this.playerInfo.rotation].length; i++) {
            for (let j = 0; j < currentPiece[this.playerInfo.rotation][i].length; j++) {
                if (currentPiece[this.playerInfo.rotation][i][j] === 1) {
                    grid[k].classList.add("blocked");
                }
                k++;
            }
            k += n;
        }
    }

    movePiece(moveX = 0) {
        console.log("currentPiece: ", this.playerInfo.piece["tetrimino"], "type: ", this.playerInfo.piece.type);
        if (this.playerInfo.container) {
            const grid = this.playerInfo.container.getElementsByClassName("grid-item");
            const newX = this.playerInfo.x + moveX;

            if (this.isPieceWithinBoundary(this.playerInfo.piece.tetrimino, newX, this.playerInfo.y, grid)) {
                console.log("piece is within boundary put piece x", newX, "y ", this.playerInfo.y);
                this.replacePiece(this.playerInfo.piece.tetrimino, this.playerInfo.piece.type, newX, this.playerInfo.y, grid);
                // needs to be set into a timer that changes each second player[0].setAttribute("y", y + 1);
                return true;
            } else {
                // if player reached bottom of board (cannot move further down change active piece of player)
                return false;
            }
        }
    }

    startGame() {
        if (!this.movePiece()) {
            console.log("could not move piece further down. Sets the piece as blocked and picks new piece for player");
            if (this.playerInfo.container) {
                const grid = this.playerInfo.container.getElementsByClassName("grid-item");
                this.setPieceAsBlocked(this.playerInfo.piece.tetrimino, this.playerInfo.x, this.playerInfo.y, grid);
                this.updatePiece();
            }
        }
    }

    updatePiece() {
        this.playerInfo.pieceIndx += 1
        this.playerInfo.piece = this.playerInfo.getPiece(this.playerInfo.pieceIndx);
        this.playerInfo.rotation = 0;
        this.playerInfo.x = 4;
        this.playerInfo.y = 0;
    }

    rotatePiece() {
        this.playerInfo.rotation = this.playerInfo.rotation + 1 === 4 ? 0 : this.playerInfo.rotation + 1;
        this.movePiece();
    }
}

export const Game: React.FC<GameProps> = ({ gameState, playerName, room }) => {
    const { getPiece } = useQueueContext();
    const playerData: PlayerInfo = {
        container: document.getElementsByClassName("container-of-player-" + playerName)[0],
        rotation: 0,
        pieceIndx: 0,
        piece: getPiece(0),
        x: 4,
        y: 0,
        getPiece: getPiece
      };
    const gameLogicRef = useRef(new GameLogic(playerData));

    useEffect(() => {
        if (gameState === "Pause") {
            console.log("Start game");
            gameLogicRef.current.startGame();
        } else if (gameState === "Start") {
            console.log("Pause game");
        }
    }, [gameState, room, playerName]);

    const handleKeyPress = (e) => {
        console.log( "You pressed a key: ", e.keyCode );
        if (e.keyCode === 37) {
            console.log("left 37 - move piece left");
            gameLogicRef.current.movePiece(-1);
        } else if (e.keyCode === 38) {
            gameLogicRef.current.rotatePiece();
            console.log(" up 38 - rotate clockwise rotation: ");
        } else if (e.keyCode === 39) {
            console.log("right 39 - move piece right");
            gameLogicRef.current.movePiece(1);
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
