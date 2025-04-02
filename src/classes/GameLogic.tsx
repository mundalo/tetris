import { Piece, getPieceColor } from './Piece';
import socketServiceInstance from '../services/service';

export interface PlayerInfo {
    name: string;
    container: Element;
    rotation: number;
    pieceIndx: number;
    piece: Piece;
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    prevRotation: number;
}

export class GameLogic {
    playerInfo: PlayerInfo;
    getPiece: (i: number) => Piece | null;
    intervalId: NodeJS.Timeout | null = null;
    currentInterval: number = 1000;
    decrementInterval: number = 100;
    minInterval: number = 100;

    constructor(playerInfo: PlayerInfo, getPiece: (i: number) => Piece | null) {
        this.playerInfo = playerInfo;
        this.getPiece = getPiece;
    }

    isPieceWithinBoundary(grid) {
        let n = 10 - 4;
        let k = this.playerInfo.x + (this.playerInfo.y * 10);
        const piece = this.playerInfo.piece.tetrimino;

        for (let i = 0; i < piece[this.playerInfo.rotation].length; i++) {
            for (let j = 0; j < piece[this.playerInfo.rotation][i].length; j++) {
                if (piece[this.playerInfo.rotation][i][j] === 1) {

                    if (k >= 200) {
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

    putPiece(grid) {
        let n = 10 - 4;
        let k = this.playerInfo.x + (this.playerInfo.y * 10);

        for (let i = 0; i < this.playerInfo.piece.tetrimino[this.playerInfo.rotation].length; i++) {
            for (let j = 0; j < this.playerInfo.piece.tetrimino[this.playerInfo.rotation][i].length; j++) {
                if (this.playerInfo.piece.tetrimino[this.playerInfo.rotation][i][j] === 1) {
                    grid[k].style.backgroundColor = getPieceColor(this.playerInfo.piece.type);
                }
                k++;
            }
            k += n;
        }
    }

    removePiece(grid) {
        let n = 10 - 4;
        let k = this.playerInfo.prevX + (this.playerInfo.prevY * 10);

        for (let i = 0; i < this.playerInfo.piece.tetrimino[this.playerInfo.prevRotation].length; i++) {
            for (let j = 0; j < this.playerInfo.piece.tetrimino[this.playerInfo.prevRotation][i].length; j++) {
                if (this.playerInfo.piece.tetrimino[this.playerInfo.prevRotation][i][j] === 1) {
                    grid[k].style.backgroundColor = getPieceColor(0);
                }
                k++;
            }
            k += n;
        }
    }

    replacePiece(grid) {
        if (this.playerInfo.prevY >= 0) {
            this.removePiece(grid);
        }
        this.putPiece(grid);
        this.playerInfo.prevX = this.playerInfo.x;
        this.playerInfo.prevY = this.playerInfo.y;
        this.playerInfo.prevRotation = this.playerInfo.rotation;
    }

    setPieceAsBlocked() {
        const grid = this.playerInfo.container.getElementsByClassName("grid-item");
        let n = 10 - 4;
        let k = this.playerInfo.prevX + (this.playerInfo.prevY * 10);
        const currentPiece = this.playerInfo.piece.tetrimino;

        for (let i = 0; i < currentPiece[this.playerInfo.rotation].length; i++) {
            for (let j = 0; j < currentPiece[this.playerInfo.rotation][i].length; j++) {
                if (currentPiece[this.playerInfo.rotation][i][j] === 1) {
                    console.log("piece: ", this.playerInfo.piece, "i: ", i, "j: ", j, "K: ", k);
                    grid[k].classList.add("blocked");
                }
                k++;
            }
            k += n;
        }
    }

    checkIfValuesMissing() {
        if (!this.playerInfo.container) {
            this.playerInfo.container = document.getElementsByClassName("container-of-player-" + this.playerInfo.name)[0];
        }
        while (!this.playerInfo.piece) {
            this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        }
    }

    movePiece() {
        this.checkIfValuesMissing();

        console.log("Move Piece: ", this.playerInfo);
        console.log("currentPiece: ", this.playerInfo.piece["tetrimino"], "type: ", this.playerInfo.piece.type);
        
        const grid = this.playerInfo.container.getElementsByClassName("grid-item");

        if (this.isPieceWithinBoundary(grid)) {
            this.replacePiece(grid);
            // needs to be set into a timer that changes each second player[0].setAttribute("y", y + 1);
            return true;
        } else {
            // if player reached bottom of board (cannot move further down change active piece of player)
            return false;
        }
    }

    executeWithDecreasingInterval(
        callback: () => void,
        initialInterval: number,
        decrement: number,
        minInterval: number
      ) {
        let interval = initialInterval;
        this.intervalId = setInterval(() => {
            callback();
            if (interval > minInterval) {
                interval -= decrement;
                clearInterval(this.intervalId!);
                this.intervalId = setInterval(callback, interval);
                this.currentInterval = interval;
            }
        }, interval);
    }

    removeRow(k: number, grid) {
        const prevRowX = k - 10;

        if (prevRowX >= 0) {
            let nothingToMove = 0;
            for (let j = 0; j < 10; j++) {
                if (!grid[prevRowX + j].classList.contains("blocked")) {
                    nothingToMove++;
                    grid[k + j].classList.remove("blocked");
                } else if (grid[prevRowX + j].classList.contains("blocked") && !grid[k + j].classList.contains("blocked")) {
                    grid[k + j].classList.add("blocked");
                }
                grid[k + j].setAttribute("data-piece", grid[prevRowX + j].getAttribute("data-piece"));
                grid[k + j].style.backgroundColor = grid[prevRowX + j].style.backgroundColor;
            }

            if (nothingToMove !== 10) {
                this.removeRow(prevRowX, grid);
            }
        }
    }

    checkIfRowIsBlocked() {
        const grid = this.playerInfo.container.getElementsByClassName("grid-item");
        let k = this.playerInfo.prevY * 10;
        const rowsToCheck = k + 40 > 199 ? 199 : k + 40;

        while (k < rowsToCheck) {
            let columnsBlocked = 0;
            for (let j = 0; j < 10; j++) {
                if (grid[k + j].classList.contains("blocked")) {
                    columnsBlocked++;
                }
            }
            if (columnsBlocked === 10) {
                this.removeRow(k, grid);
            }
            k += 10;
        }
    }

    prepareNewPiece() {
        console.log("Sets the piece as blocked and picks new piece for player");
        this.checkIfValuesMissing();
        this.setPieceAsBlocked();
        this.checkIfRowIsBlocked();
        this.updatePiece();
    }

    startMovingPieces = () => {
        if (!this.movePiece()) {
            if (this.playerInfo.prevY < 0) {
                console.log("Game is Over");
                this.gameOver();
                return;
            }
            this.prepareNewPiece();
        } else {
            this.playerInfo.y += 1;
        }
    }

    startGame() {
        this.playerInfo.container = document.getElementsByClassName("container-of-player-" + this.playerInfo.name)[0];
        while (!this.playerInfo.piece) {
            this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        }

        this.executeWithDecreasingInterval(this.startMovingPieces, this.currentInterval, this.decrementInterval, this.minInterval);
    }

    clearGameInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    gameOver() {
        console.log("Game Over");
        this.clearGameInterval();
        alert("Game Over! You Lost!");
        // reset all values
        const grid = this.playerInfo.container.getElementsByClassName("grid-item");
        for (let i = 0; i < grid.length; i++) {
            const item = grid[i] as HTMLElement;
            item.classList.remove("blocked");
            item.style.backgroundColor = getPieceColor(0);
            item.setAttribute("data-piece", "0");
        }
        this.playerInfo.rotation = 0;
        this.playerInfo.pieceIndx = 0;
        this.playerInfo.piece = null;
        this.playerInfo.x = 4;
        this.playerInfo.y = 0;
        this.playerInfo.prevX = -1;
        this.playerInfo.prevY = -1;
        this.playerInfo.prevRotation = -1;
        socketServiceInstance.emit('game-started', { gameState: 'Game Over' });
    }

    pauseGame() {
        console.log("Game has been paused");
        this.clearGameInterval();
    }

    updatePiece() {
        this.playerInfo.pieceIndx += 1
        this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        while (!this.playerInfo.piece) {
            this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        }    
        this.playerInfo.rotation = 0;
        this.playerInfo.x = 4;
        this.playerInfo.y = 0;
        this.playerInfo.prevX = -1;
        this.playerInfo.prevY = -1;
        this.playerInfo.prevRotation = -1;
    }

    rotatePiece() {
        this.playerInfo.rotation = this.playerInfo.rotation + 1 === 4 ? 0 : this.playerInfo.rotation + 1;
        if (this.playerInfo.x + this.getPieceWidth() > 9) {
            this.playerInfo.x = 9 - this.getPieceWidth();
        } else if (this.playerInfo.x < 0 - this.getPieceStartPos()) {
            this.playerInfo.x = 0 - this.getPieceStartPos();
        }

        if (!this.movePiece()) {
            this.playerInfo.rotation = this.playerInfo.prevRotation;
        }
    }

    getPieceWidth(): number {
        const piece = this.playerInfo.piece.tetrimino;
        let width = 0;
        for (let i = 0; i < piece[this.playerInfo.rotation].length; i++) {
            const newWidth = piece[this.playerInfo.rotation][i].lastIndexOf(1);
            if (newWidth > width) {
                width = newWidth;
            }
        }
        return width;
    }

    getPieceHeight(): number {
        const piece = this.playerInfo.piece.tetrimino[this.playerInfo.rotation];
        console.log("piece: ", piece, "piece.length: ", piece.length);
        for (let i = piece.length - 1; i >= 0; i--) {
            const hasValue = piece[i].includes(1);
            if (hasValue) {
                console.log("hasValue: ", hasValue, "i: ", i);
                return i;
            }
        }
        return 0;
    }

    getPieceStartPos() {
        const piece = this.playerInfo.piece.tetrimino[this.playerInfo.rotation];
        let start = piece.length - 1;

        for (let i = 0; i < piece.length; i++) {
            const newStart = piece[i].indexOf(1);
            if (newStart !== -1 && newStart < start) {
                start = newStart;
            }
        }

        return start;
    }

    handleKeyPressEvent(e: React.KeyboardEvent<HTMLDivElement>) {
        e.preventDefault();
        switch (e.keyCode) {
            case 37:
                this.playerInfo.x = this.playerInfo.x - 1 < (0 - this.getPieceStartPos()) ? 0 - this.getPieceStartPos() : this.playerInfo.x - 1;
                if (!this.movePiece()) {
                    this.playerInfo.x = this.playerInfo.prevX;
                }
                break;
            case 38:
                this.rotatePiece();
                break;
            case 39:
                this.playerInfo.x = this.playerInfo.x + 1 > (9 - this.getPieceWidth()) ? 9 - this.getPieceWidth() : this.playerInfo.x + 1;
                if (!this.movePiece()) {
                    this.playerInfo.x = this.playerInfo.prevX;
                }
                break;
            case 40:
                this.clearGameInterval();
                this.playerInfo.y += 1;
                
                if (!this.movePiece()) {
                    this.prepareNewPiece();
                }
                break;
            case 32:
                while (this.movePiece()) {
                    this.playerInfo.y += 1;
                }
                this.prepareNewPiece();
                break;
            default:
                break;
        }
    }

    handleKeyUpEvent(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.keyCode === 40) {
            this.executeWithDecreasingInterval(this.startMovingPieces, this.currentInterval, this.decrementInterval, this.minInterval);
        }
    }
}
