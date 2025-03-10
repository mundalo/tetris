import React from 'react';
import './Board.css'; // Import the CSS for styling

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {player: props.player};
    }

    render() {
        const gridItems = []; // Create an array to populate the grid items
        
        // Create 10x20 grid items
        for (let i = 0; i < 10 * 20; i++) {
            gridItems.push(<div key={i} row={Math.floor(i / 10)} column={i % 10} className="grid-item"></div>);
        }

        return (
            <div player={this.state.player}>
                <h2>Player {this.state.player} !</h2>
                <div className="grid-container">
                    {gridItems}
                </div>
            </div>
        );
    }
    /*render() {
        return (
            <Tetris>
                {({
                    Gameboard,
                    PieceQueue,
                    points,
                    linesCleared,
                    state,
                    controller
                }) => (
                    <div>
                        <h2>Player: {this.state.player}</h2>
                        <div>
                            <p>Points: {points}</p>
                            <p>Lines Cleared: {linesCleared}</p>
                        </div>
                        <PieceQueue />
                        <Gameboard />
                        {state === 'LOST' && (
                            <div>
                                <h2>Game Over</h2>
                                <button onClick={controller.restart}>New game</button>
                            </div>
                        )}
                    </div>
                )}
            </Tetris>
        );
    }*/
}

export default Board;