import './Tetriminos'

class Piece extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {color: props.color, game: props.game};
    }

}
