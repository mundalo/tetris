import React, { createContext, useState, useContext, useEffect } from 'react';
import { generatePiece } from './Piece'

const QueueContext = createContext();

export const useQueueContext = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);

    const addPieceToQueue = (piece) => {
        setQueue((prevQueue) => [...prevQueue, piece]);
    }

    const getPiece = (i) => {
        if (queue.length > 0) {
            const piece = queue[i];
            setQueue((prevQueue) => prevQueue.slice(1));
            return piece;
        }
        return null;
    }

    const removePiece = () => {
        if (queue.length > 0) {
            setQueue((prevQueue) => prevQueue.slice(1));
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (queue.length < 50) {
                const newPiece = generatePiece();
                addPieceToQueue(newPiece);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [queue.length]);

    return (
        <QueueContext.Provider value={{ queue, addPieceToQueue, getPiece, removePiece }}>
            {children}
        </QueueContext.Provider>
    );
};
