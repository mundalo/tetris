//import logo from './logo.svg';
//<img src={logo} className="App-logo" alt="logo" />
/*
<a
  className="App-link"
  href="https://reactjs.org"
  target="_blank"
  rel="noopener noreferrer"
>
  Learn React
</a>
*/
import './App.css';
import { Game } from './classes/Game.js'
import { QueueProvider } from './classes/PieceQueue';

// classes Player, Piece and Game classes

function App() {
  return (
    <QueueProvider>
      <Game/>
    </QueueProvider>
  );
}

export default App;
