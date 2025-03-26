import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Piece, generatePiece } from './Piece'

interface QueueContextType {
    queue: Piece[];
    getPiece: (i: number) => Piece | null;
    removePiece: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueueContext = (): QueueContextType => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error("useQueueContext must be used within a QueueProvider");
    }
    return context;
}

interface QueueProviderProps {
    children: ReactNode;
}

export const QueueProvider = ({ children }: QueueProviderProps): ReactNode => {
    const [queue, setQueue] = useState<Piece[]>([]);
    const [size, setSize] = useState<number>(20);

    const getPiece = (i: number): Piece | null => {
        if (i >= 0 && i < queue.length) {
            return queue[i];
        }
        setSize(i + size);
        return null;
    }

    const removePiece = (): void => {
        if (queue.length > 0) {
            setQueue((prevQueue) => prevQueue.slice(1));
        }
    }

    function isPiece(piece: any): piece is Piece {
        return piece && typeof piece.type === 'number' && 
        Array.isArray(piece.tetrimino) && 
        piece.tetrimino.every((arr: any) => Array.isArray(arr) &&
        arr.every((subArr: any) => Array.isArray(subArr) && subArr.every((el: any) => typeof el === "number")));
    }

    useEffect(() => {
        if (queue.length < size) {
            const newPiece = generatePiece();
            if (isPiece(newPiece)) {
                setQueue((prevQueue) => [...prevQueue, newPiece]);
            }
        }
    }, [queue.length, size]);

    return (
        <QueueContext.Provider value={{ queue, getPiece, removePiece }}>
            {children}
        </QueueContext.Provider>
    );
};
