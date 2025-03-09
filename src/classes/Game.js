import React from 'react';
import GridComponent from './GridComponent';

class Game extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {color: props.color};
    }
    render() {
        //return <h2>I am a {this.state.color} Car!</h2>
        return (
            <div className="App">
                <header className="App-header">
                    <p>Tetris</p>
                </header>
                <div className="board">
                    <h1>Tetris</h1>
                    <h2>I am a {this.state.color} Car!</h2>
                    <div className="grid-parent-container"> 
                        <GridComponent player="1"/>
                        <GridComponent player="2"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
