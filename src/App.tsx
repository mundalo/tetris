import './App.css';
//import { useState } from 'react'
import { Game } from './classes/Game'
import { QueueProvider } from './classes/PieceQueue';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useParams } from 'react-router-dom'
// classes Player, Piece and Game classes

function App() {
  return (
    <Router>
      <Routes>
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

const GameWrapper = () => {
  const {room, playerName } = useParams<{ room: string, playerName: string }>();

  if (!room || !playerName) {
    return <div>Error: Room or Player Name is missing in the URL</div>
  }

  return <Game room={room} playerName={playerName} />
}

export default App;
