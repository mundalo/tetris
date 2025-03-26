import './App.css';
import { useState, useEffect } from 'react'
import { Game } from './classes/Game'
import { QueueProvider } from './classes/PieceQueue';
import Controls from './classes/Controls';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import socketServiceInstance from './services/service';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/" 
          element={
            <DefaultWrapper />
          }
        />
        <Route 
          path="/:room/:playerName"
          element={
            <QueueProvider>
              <GameWrapper/>
            </QueueProvider>
          }
        />
      </Routes>
    </Router>
  );
}

const DefaultWrapper = () => {
  return (
    <div>
      <h1>Welcome to the game of Tetris</h1>
        <p>To start playing by yourself or with a friend specify room to play in and your playername like shown below</p>
        <p>https://localhost:8000/your-choosen-room-name/your-choosen-player-name</p>
        <p>Room name has to be the same to play with your friend</p>
        <p>Player name has to be unique</p>
      <Controls />
    </div>)
}

const GameWrapper = () => {
  const {room, playerName } = useParams<{ room: string, playerName: string }>();
  const [players, setPlayers] = useState<string[]>([]);
  const [startPlayer, setStartPlayer] = useState<string>(null);
  const [buttonText, setButtonText] = useState('Start Game');
  const [gameState, setGameState] = useState('Start');

  useEffect(() => {
    if (!room || !playerName) {
      console.log("no room nor playername");
      return;
    }
    console.log(`Connecting to room: ${room}, player: ${playerName}`);
    
    socketServiceInstance.connect(room, playerName);
    
    const handleRoomInfo = (data: { players: string[], startPlayer: string }) => {
      console.log("received room-info", data);
      setPlayers(data.players);
      setStartPlayer(data.startPlayer);
    }
    
    const handleGameStarted = (state) => {
      setButtonText(state === "Start" ? "Pause Game" : "Start Game");
      setGameState(state === "Start" ? "Pause" : "Start");
    }

    socketServiceInstance.socket?.on('room-info', handleRoomInfo);

    socketServiceInstance.socket?.on('game-started', handleGameStarted);

    const handleBeforeUnload = () => {
      socketServiceInstance.emit('player-disconnect', { room, playerName });
      socketServiceInstance.socket?.off('room-info', handleRoomInfo);
      socketServiceInstance.socket?.off('game-started', handleGameStarted);
      socketServiceInstance.socket?.disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.log("Cleaning up socket connection...");
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socketServiceInstance.disconnect();
    };
  }, [room, playerName]);

  const handleGameState = () => {
    console.log("Handle Game State, ", gameState, "request from ", playerName, "only startPlayer can do this: ", startPlayer);
    if (playerName === startPlayer) {
      setButtonText(gameState === "Start" ? "Pause Game" : "Start Game");
      setGameState(gameState === "Start" ? "Pause" : "Start");
      socketServiceInstance.emit('start-game', { gameState, room, playerName });
    }
  };

  const handleLeaveGame = () => {
      socketServiceInstance.emit('player-disconnect', { room, playerName });
      socketServiceInstance.disconnect();
  };

  if (!room || !playerName) {
    return <div>Error: Room or Player Name is missing in the URL</div>
  }

  return (
    <div>
      <header className="App-header">
          <p>Tetris Game - Room {room} </p>
      </header>
      <p>Players in room: </p>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      <button id="state_btn" onClick={handleGameState}>
        {buttonText}
      </button>
      <button onClick={handleLeaveGame}>
        Leave Game
      </button>
      <Game gameState={gameState} room={room} playerName={playerName} />
    </div>)
}

export default App;
