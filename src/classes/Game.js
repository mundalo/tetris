import React from 'react';
import Board from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {color: props.color, game: props.game};
    }

    startGame = () => {
        const button = document.getElementById("start_btn");

        if (this.state.game === "Start" || this.state.game === "Resume") {
            button.innerHTML = "Pause";
            this.setState({game: "Pause"});
        } else if (this.state.game === "Pause") {
            button.innerHTML = "Resume";
            this.setState({game: "Resume"});
        } else if (this.state.game === "End") {
            button.innerHTML = "Start";
            this.setState({game: "Start"})
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
                    <h2>I am a {this.state.color} Car!</h2>
                    <button id="start_btn" onClick={this.startGame}>Start</button>
                    <div className="grid-parent-container"> 
                        <Board player="1"/>
                        <Board player="2"/>
                    </div>
                </div>
            </div>
        );
    } 
}

export default Game;
