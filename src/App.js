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
import ReactDOM from 'react-dom/client';
import Game from './classes/Game.js'
// classes Player, Piece and Game classes

function App() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Game color="blue"/>);
}

export default App;
