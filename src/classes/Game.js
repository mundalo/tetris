import React from 'react';
import Player from './Player';
import Controls from './Controls';
import { QueueProvider } from './PieceQueue';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {color: props.color, game: props.game, players: props.players};
    }

    startGame = () => {
        this.updateStateText("Pause")

        for (let i = 1; i <= Number(this.state.players); i++) {
            const container = document.getElementsByClassName("container-of-player-" + i);
            if (container[0]) {
                const grid = container[0].getElementsByClassName("grid-item");
                for (let j = 0; j < grid.length; j++) {
                    //grid[j].style.backgroundColor = "blue";
                    if (j % 2 === 0) {
                        grid[j].className = grid[j].className + " blocked";
                        console.log("contains: " + grid[j].classList.contains("blocked"));
                    } else {
                        grid[j].style.backgroundColor = "blue";
                        console.log("contains: " + grid[j].classList.contains("blocked"));
                    }
                    
                }
            }
        }
    }

    updateStateText = (state) => {
        const button = document.getElementById("state_btn");

        button.innerHTML = state;
        this.setState({game: state});
    }

    changeGameState = () => {
        if (this.state.game === "Start" || this.state.game === "Resume") {
            this.startGame();
        } else if (this.state.game === "Pause") {
            this.updateStateText("Resume");
        } else if (this.state.game === "End") {
            this.updateStateText("Start");
        }
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Tetris</p>
                </header>
                <div className="board">
                    <h1>Tetris</h1>
                    <Controls />
                    <button id="state_btn" onClick={this.changeGameState}>Start</button>
                    <QueueProvider>
                        <div className="grid-parent-container"> 
                            <Player player="1"/>
                            <Player player="2"/>
                        </div>
                    </QueueProvider>
                </div>
            </div>
        );
    } 
}

export default Game;
