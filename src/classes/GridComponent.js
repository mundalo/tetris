import React from 'react';
import './GridComponent.css'; // Import the CSS for styling

class GridComponent extends React.Component {
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
}

export default GridComponent;