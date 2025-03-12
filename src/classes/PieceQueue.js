import React, { createContext, useState, useContext, useEffect } from 'react';
import { generatePiece } from './Piece'

const QueueContext = createContext();

export const useQueueContext = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [size, setSize] = useState(20);

    const getPiece = (i) => {
        if (i >= 0 && i < queue.length) {
            console.log("return piece", queue[i], "length: ", queue.length);
            return queue[i];
        }
        setSize(i + size);
        return null;
    }

    const removePiece = () => {
        if (queue.length > 0) {
            setQueue((prevQueue) => prevQueue.slice(1));
        }
    }

    useEffect(() => {
        if (queue.length < size) {
            setQueue((prevQueue) => [...prevQueue, generatePiece()]);
        }
    }, [queue.length, size]);

    return (
        <QueueContext.Provider value={{ queue, getPiece, removePiece }}>
            {children}
        </QueueContext.Provider>
    );
};
