import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
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
        if (i + 5 >= queue.length) {
            setSize(i + 100);
        }
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

    const generateMorePieces = useCallback((requiredSize: number) => {
        const piecesToGenerate = requiredSize - queue.length;
        if (piecesToGenerate > 0) {
            const newPieces = [];
            for (let i = 0; i < piecesToGenerate; i++) {
                const newPiece = generatePiece();
                if (isPiece(newPiece)) {
                    newPieces.push(newPiece);
                }
            }
            if (newPieces.length > 0) {
                setQueue((prevQueue) => [...prevQueue, ...newPieces]);
            }
        }
    }, [queue.length]);

    /*useEffect(() => {
        console.log("useEffect queue.lenght: ", queue.length, "size: ", size + 20);
        if (queue.length <= size + 20) {
            console.log("queue length < size - generate new piece");
            const newPiece = generatePiece();
            if (isPiece(newPiece)) {
                return setQueue((prevQueue) => [...prevQueue, newPiece]);
            }
        }
    }, [size, queue.length]);
*/
    useEffect(() => {
        console.log("useEffect - queue length: ", queue.length, " size: ", size);
        // Only generate more pieces if the queue has fewer pieces than we need
        if (queue.length <= size + 20) {
            console.log("Generating more pieces...");
            generateMorePieces(size + 100);  // Ensure enough pieces are in the queue
        }
    }, [queue.length, size, generateMorePieces]);

    return (
        <QueueContext.Provider value={{ queue, getPiece, removePiece }}>
            {children}
        </QueueContext.Provider>
    );
};
