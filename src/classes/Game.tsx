import React, {/* useState,*/useEffect, useRef, useMemo } from 'react';
import Player from './Player';
import { useQueueContext } from './PieceQueue';
import { GameLogic, PlayerInfo } from './GameLogic';
//import socketServiceInstance from '../services/service';

interface GameProps {
    gameState: string;
    playerName: string;
    room: string;
}

export const Game: React.FC<GameProps> = ({ gameState, playerName, room }) => {
    const { getPiece } = useQueueContext();
    const gameLogicRef = useRef<GameLogic | null>(null);
    const playerData: PlayerInfo = useMemo(() => ({
        name: playerName,
        container: null,
        rotation: 0,
        pieceIndx: 0,
        piece: null,
        x: 4,
        y: 0,
        prevX: -1,
        prevY: -1,
        prevRotation: -1,
      }), [playerName]);

    useEffect(() => {
        gameLogicRef.current = new GameLogic(playerData, getPiece);

        return () => {
            console.log("Game component unmounted, cleaning up...");
            gameLogicRef.current = null;
        };
    }, [playerData, getPiece]);

    useEffect(() => {
        if (gameState === "Start" && gameLogicRef.current) {
            console.log('Game paused');
        } else if (gameState === "Pause" && gameLogicRef.current) {
            gameLogicRef.current.startGame();
        }
    }, [gameState]);

    return (
        <div 
            className="App" 
            onKeyDown={(e) => gameLogicRef.current?.handleKeyPressEvent(e)} 
            tabIndex={0}
        >
            <div className="board">
                <div className="grid-parent-container"> 
                    <Player player={playerName} />
                </div>
            </div>
        </div>
    );
}
