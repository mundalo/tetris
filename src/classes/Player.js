import React from 'react';
import BoardGrid from './BoardGrid';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {player: props.player};
    }

    init = () => {
        const name = "player-grid-" + this.state.player;

        return (
            <div className={name} player={this.state.player} piece_index="0" x="0" y="0">
                <BoardGrid player={this.state.player}/>
            </div>
        )
    };

    render() {
        return (
            this.init()
        )
    }
}

export default Player;
