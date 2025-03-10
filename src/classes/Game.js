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
                    <h2>Keyboard controls</h2>
                    <li>
                        <ul>down key: move a piece to the bottom faster</ul>
                        <ul>left key: move piece left</ul>
                        <ul>right key: move piece right</ul>
                        <ul>space bar: drop piece to the bottom</ul>
                        <ul>z: flip piece counter-clockwise</ul>
                        <ul>x: flip piece clockwise</ul>
                        <ul>up: flip piece clockwise</ul>
                        <ul>p: toggle pause</ul>
                        <ul>c: hold</ul>
                        <ul>shift: hold</ul>
                    </li>
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
