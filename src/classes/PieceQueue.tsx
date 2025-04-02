import React, { createContext, useContext, ReactNode } from 'react';
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
    const queue: Piece[] = [];

    const getPiece = (i: number): Piece | null => {
        if (i >= 0 && i < queue.length) {
            return queue[i];
        }
        console.log("queue is smaller than index i: ", i);
        if (i >= queue.length) {
            console.log("set new size: ", i + 100);
            generateMorePieces(i + 100);
        }
        return null;
    }

    const removePiece = (): void => {
        if (queue.length > 0) {
            console.log("remove piece from queue: ", queue[0]);
            queue.slice(1);
        }
    }

    function isPiece(piece: any): piece is Piece {
        return piece && typeof piece.type === 'number' && 
        Array.isArray(piece.tetrimino) && 
        piece.tetrimino.every((arr: any) => Array.isArray(arr) &&
        arr.every((subArr: any) => Array.isArray(subArr) && subArr.every((el: any) => typeof el === "number")));
    }

    const generateMorePieces = (requiredSize: number) => {
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
                queue.push(...newPieces);
                console.log("New pieces added to queue: ", newPieces);
            }
        }
    };

    return (
        <QueueContext.Provider value={{ queue, getPiece, removePiece }}>
            {children}
        </QueueContext.Provider>
    );
};
