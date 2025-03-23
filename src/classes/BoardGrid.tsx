import React from 'react';
import './BoardGrid.css'; // Import the CSS for styling

interface BoardGridProps {
    player: number;
}

interface BoardGridState {
    player: number;
}

class BoardGrid extends React.Component<BoardGridProps, BoardGridState> {
    constructor(props: BoardGridProps) {
        super(props);
        this.state = {player: props.player};
    }

    render() {
        const gridItems = [];
        const containerOfPlayer = "container-of-player-" + this.state.player;

        // Create 10x20 grid items
        for (let i = 0; i < 10 * 20; i++) {
            gridItems.push(<div key={i} data-row={Math.floor(i / 10)} data-column={i % 10} className="grid-item" data-piece={0}></div>);
        }

        return (
            <div className={containerOfPlayer}>
                <h2>Player {this.state.player} !</h2>
                <div className="grid-container">
                    {gridItems}
                </div>
            </div>
        );
    }
}

export default BoardGrid;