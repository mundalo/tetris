import React from 'react';
import BoardGrid from './BoardGrid';

interface PlayerProps {
    player: string;
}

interface PlayerState {
    player: string;
}

class Player extends React.Component<PlayerProps, PlayerState> {
    constructor(props: PlayerProps) {
        super(props);
        this.state = {player: props.player};
    }

    init = () => {
        const name = "player-grid-" + this.state.player;

        return (
            <div className={name} data-player={this.state.player}>
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
