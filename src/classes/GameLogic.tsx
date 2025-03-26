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

    constructor(playerInfo: PlayerInfo, getPiece: (i: number) => Piece | null) {
        this.playerInfo = playerInfo;
        this.getPiece = getPiece;
    }

    isPieceWithinBoundary(x: number, grid) {
        let n = 10 - 4;
        let k = x + (this.playerInfo.y * 10);
        const piece = this.playerInfo.piece.tetrimino;

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

    putPiece(x: number, grid) {
        let n = 10 - 4;
        let k = x + (this.playerInfo.y * 10);

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

    replacePiece(x: number, grid) {
        console.log("replacepiece: prevY: ", this.playerInfo.prevY, "prevX: ", this.playerInfo.prevX, "prevrotattion: ", this.playerInfo.prevRotation);
        if (this.playerInfo.prevY >= 0 && this.playerInfo.prevX >= 0 && this.playerInfo.prevRotation >= 0) {
            this.removePiece(grid);
        }
        this.putPiece(x, grid);
        this.playerInfo.prevX = x;
        this.playerInfo.prevY = this.playerInfo.y;
        this.playerInfo.prevRotation = this.playerInfo.rotation;
        console.log("afternew piece has been put: prevY: ", this.playerInfo.prevY, "prevX: ", this.playerInfo.prevX, "prevrotattion: ", this.playerInfo.prevRotation);
        
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

    checkIfValuesMissing() {
        if (!this.playerInfo.container) {
            this.playerInfo.container = document.getElementsByClassName("container-of-player-" + this.playerInfo.name)[0];
        }
        if (!this.playerInfo.piece) {
            this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        }
    }

    movePiece(moveX = 0) {
        this.checkIfValuesMissing();

        console.log("Move Piece: ", this.playerInfo);
        console.log("currentPiece: ", this.playerInfo.piece["tetrimino"], "type: ", this.playerInfo.piece.type);
        
        const grid = this.playerInfo.container.getElementsByClassName("grid-item");
        const newX = this.playerInfo.x + moveX;

        if (this.isPieceWithinBoundary(newX, grid)) {
            console.log("piece is within boundary put piece x", newX, "y ", this.playerInfo.y);
            this.replacePiece(newX, grid);
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

        if (!this.movePiece()) {
            console.log("could not move piece further down. Sets the piece as blocked and picks new piece for player");
            this.checkIfValuesMissing();
            const grid = this.playerInfo.container.getElementsByClassName("grid-item");
            this.setPieceAsBlocked(this.playerInfo.piece.tetrimino, this.playerInfo.x, this.playerInfo.y, grid);
            this.updatePiece();
        }
    }

    updatePiece() {
        this.playerInfo.pieceIndx += 1
        this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        this.playerInfo.rotation = 0;
        this.playerInfo.x = 4;
        this.playerInfo.y = 0;
    }

    rotatePiece() {
        this.playerInfo.rotation = this.playerInfo.rotation + 1 === 4 ? 0 : this.playerInfo.rotation + 1;
        this.movePiece();
    }

    handleKeyPressEvent(e: React.KeyboardEvent<HTMLDivElement>) {
        console.log( "You pressed a key: ", e.keyCode );
        switch (e.keyCode) {
            case 37:
                console.log("left 37 - move piece left");
                this.movePiece(-1);
                break;
            case 38:
                this.rotatePiece();
                console.log(" up 38 - rotate clockwise rotation: ");
                break;
            case 39:
                console.log("right 39 - move piece right");
                this.movePiece(1);
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
