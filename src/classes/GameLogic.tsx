import { Piece, getPieceColor } from './Piece';

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
    interval: NodeJS.Timeout | string | number | undefined;

    constructor(playerInfo: PlayerInfo, getPiece: (i: number) => Piece | null) {
        this.playerInfo = playerInfo;
        this.getPiece = getPiece;
    }

    isPieceWithinBoundary(grid) {
        let n = 10 - 4;
        let k = this.playerInfo.x + (this.playerInfo.y * 10);
        const piece = this.playerInfo.piece.tetrimino;

        console.log("select piece: ", piece[this.playerInfo.rotation]);
        const row = grid[k].getAttribute("data-row");
        const col = grid[k].getAttribute("data-column");

        for (let i = 0; i < piece[this.playerInfo.rotation].length; i++) {
            for (let j = 0; j < piece[this.playerInfo.rotation][i].length; j++) {
                if (piece[this.playerInfo.rotation][i][j] === 1) {
                    console.log("Piece at i: ", i, " j: ", j, " === 1");

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
        console.log("remove previous piece");
        let n = 10 - 4;
        let k = this.playerInfo.prevX + (this.playerInfo.prevY * 10);

        for (let i = 0; i < this.playerInfo.piece.tetrimino[this.playerInfo.prevRotation].length; i++) {
            for (let j = 0; j < this.playerInfo.piece.tetrimino[this.playerInfo.prevRotation][i].length; j++) {
                if (this.playerInfo.piece.tetrimino[this.playerInfo.prevRotation][i][j] === 1) {
                    console.log("found previous tetrimono position - change color i: ", i,", j: ", j, "k: ", k);
                    grid[k].style.backgroundColor = getPieceColor(0);
                }
                k++;
            }
            k += n;
        }
    }

    replacePiece(grid) {
        console.log("replacepiece: prevY: ", this.playerInfo.prevY, "prevX: ", this.playerInfo.prevX, "prevrotattion: ", this.playerInfo.prevRotation);
        if (this.playerInfo.prevY >= 0 && this.playerInfo.prevX >= 0 && this.playerInfo.prevRotation >= 0) {
            this.removePiece(grid);
        }
        this.putPiece(grid);
        this.playerInfo.prevX = this.playerInfo.x;
        this.playerInfo.prevY = this.playerInfo.y;
        this.playerInfo.prevRotation = this.playerInfo.rotation;
        console.log("afternew piece has been put: prevY: ", this.playerInfo.prevY, "prevX: ", this.playerInfo.prevX, "prevrotattion: ", this.playerInfo.prevRotation);
        
    }

    setPieceAsBlocked(grid) {
        let n = 10 - 4;
        let k = this.playerInfo.prevX + (this.playerInfo.prevY * 10);
        const currentPiece = this.playerInfo.piece.tetrimino;

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

    checkIfValuesMissing() {
        if (!this.playerInfo.container) {
            this.playerInfo.container = document.getElementsByClassName("container-of-player-" + this.playerInfo.name)[0];
        }
        if (!this.playerInfo.piece) {
            this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        }
    }

    movePiece() {
        this.checkIfValuesMissing();

        console.log("Move Piece: ", this.playerInfo);
        console.log("currentPiece: ", this.playerInfo.piece["tetrimino"], "type: ", this.playerInfo.piece.type);
        
        const grid = this.playerInfo.container.getElementsByClassName("grid-item");

        if (this.isPieceWithinBoundary(grid)) {
            console.log("piece is within boundary put piece x", this.playerInfo.x, "y ", this.playerInfo.y);
            this.replacePiece(grid);
            // needs to be set into a timer that changes each second player[0].setAttribute("y", y + 1);
            return true;
        } else {
            // if player reached bottom of board (cannot move further down change active piece of player)
            return false;
        }
    }

    startGame() {
        this.playerInfo.container = document.getElementsByClassName("container-of-player-" + this.playerInfo.name)[0];
        if (!this.playerInfo.piece) {
            this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        }

        this.interval = setInterval(() => {
            if (!this.movePiece()) {
                console.log("could not move piece further down.");
                console.log("if no more pieces can be put at the top game is over");
                if (this.playerInfo.prevX < 0 || this.playerInfo.prevY < 0 || this.playerInfo.prevRotation < 0) {
                    console.log("Game is Over");
                    this.stopGame();
                    alert("Game is over");
                    return;
                }
                console.log("Sets the piece as blocked and picks new piece for player");
                this.checkIfValuesMissing();
                const grid = this.playerInfo.container.getElementsByClassName("grid-item");
                this.setPieceAsBlocked(grid);
                this.updatePiece();
            } else {
                this.playerInfo.y += 1;
            }
        }, 1000); // Adjust the interval as needed (1000ms = 1 second)
    }

    stopGame() {
        console.log("stop game");
        clearInterval(this.interval);
    }

    updatePiece() {
        this.playerInfo.pieceIndx += 1
        this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        this.playerInfo.rotation = 0;
        this.playerInfo.x = 4;
        this.playerInfo.y = 0;
        this.playerInfo.prevX = -1;
        this.playerInfo.prevY = -1;
        this.playerInfo.prevRotation = -1;
    }

    rotatePiece() {
        this.playerInfo.rotation = this.playerInfo.rotation + 1 === 4 ? 0 : this.playerInfo.rotation + 1;
        this.movePiece();
    }

    getPieceLen() {
        const piece = this.playerInfo.piece.tetrimino;
        let len = 0;
        for (let i = 0; i < piece[this.playerInfo.rotation].length; i++) {
            const newLen = piece[this.playerInfo.rotation][i].lastIndexOf(1);
            if (newLen > len) {
                len = newLen;
            }
        }
        return len;
    }

    handleKeyPressEvent(e: React.KeyboardEvent<HTMLDivElement>) {
        console.log( "You pressed a key: ", e.keyCode );
        switch (e.keyCode) {
            case 37:
                console.log("left 37 - move piece left");
                this.playerInfo.x = this.playerInfo.x - 1 < 0 ? 0 : this.playerInfo.x - 1;
                this.movePiece();
                break;
            case 38:
                this.rotatePiece();
                console.log(" up 38 - rotate clockwise rotation: ");
                break;
            case 39:
                console.log("right 39 - move piece right, ", (9 - this.getPieceLen()));
                this.playerInfo.x = this.playerInfo.x + 1 > (9 - this.getPieceLen())  ? 9 - this.getPieceLen() : this.playerInfo.x + 1;
                this.movePiece();
                break;
            case 40:
                console.log("down 40");
                // make timer faster?
                break;
            case 32:
                console.log("space 32");
                // move piece to bottom
                break;
            default:
                break;
        }
    }
}
