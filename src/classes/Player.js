import React from 'react';
import BoardGrid from './BoardGrid';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {player: props.player};
    }

    render() {
        return (
            <BoardGrid player={this.state.player}/>
        )
    }
}

export default Player;
