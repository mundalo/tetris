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
    intervalDuration: number;

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
        if (this.playerInfo.prevY >= 0) {
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

    executeWithDecreasingInterval(
        callback: () => void,
        initialInterval: number,
        decrement: number,
        minInterval: number
      ) {
        let currentInterval = initialInterval;
      
        function execute() {
          callback();
      
          currentInterval = Math.max(currentInterval - decrement, minInterval);
          setTimeout(execute, currentInterval);
        }
      
        setTimeout(execute, currentInterval);
    }

    startMovingPieces = () => {
        if (!this.movePiece()) {
            console.log("could not move piece further down.");
            console.log("if no more pieces can be put at the top game is over");
            if (this.playerInfo.prevY < 0) {
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
    }

    startGame() {
        this.playerInfo.container = document.getElementsByClassName("container-of-player-" + this.playerInfo.name)[0];
        if (!this.playerInfo.piece) {
            this.playerInfo.piece = this.getPiece(this.playerInfo.pieceIndx);
        }

        this.executeWithDecreasingInterval(this.startMovingPieces, 1000, 100, 200);
        /*
        let intervalDuration = 1000;

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

            intervalDuration = Math.max(100, intervalDuration - 50);
            clearInterval(this.interval);
            this.interval = setInterval(arguments.callee, intervalDuration);
        }, intervalDuration);*/
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
        for (let i = piece.length - 1; i >= 0; i--) {
            const hasValue = piece[i].includes(1);
            if (hasValue) {
                return i;
            }
        }
        return 0;
    }

    getPieceStartPos() {
        const piece = this.playerInfo.piece.tetrimino[this.playerInfo.rotation];
        let start = piece.length - 1;
        for (let i = 0; i < piece.length; i++) {
            const newStart = piece[i].find(elem => elem === 1);
            if (newStart < start) {
                start = newStart;
            }
        }
        return start;
    }

    handleKeyPressEvent(e: React.KeyboardEvent<HTMLDivElement>) {
        console.log( "You pressed a key: ", e.keyCode );
        e.preventDefault();
        switch (e.keyCode) {
            case 37:
                console.log("left 37 - move piece left");
                this.playerInfo.x = this.playerInfo.x - 1 < (0 - this.getPieceStartPos()) ? 0 - this.getPieceStartPos() : this.playerInfo.x - 1;
                if (!this.movePiece()) {
                    this.playerInfo.x = this.playerInfo.prevX;
                }
                break;
            case 38:
                this.rotatePiece();
                console.log(" up 38 - rotate clockwise rotation: ");
                break;
            case 39:
                console.log("right 39 - move piece right, ", (9 - this.getPieceWidth()));
                this.playerInfo.x = this.playerInfo.x + 1 > (9 - this.getPieceWidth()) ? 9 - this.getPieceWidth() : this.playerInfo.x + 1;
                if (!this.movePiece()) {
                    this.playerInfo.x = this.playerInfo.prevX;
                }
                break;
            case 40:
                console.log("down 40", this.playerInfo.y);
                // make timer faster?
                this.playerInfo.y = this.playerInfo.y + 1 > (19 - this.getPieceHeight()) ? 19 - this.getPieceHeight() : this.playerInfo.x + 1;
                console.log("down 40", this.playerInfo.y);
                this.movePiece();
                break;
            case 32:
                console.log("space 32");
                while (!this.movePiece()) {
                    this.checkIfValuesMissing();
                    const grid = this.playerInfo.container.getElementsByClassName("grid-item");
                    this.setPieceAsBlocked(grid);
                    this.updatePiece();
                }
                break;
            default:
                break;
        }
    }
}
