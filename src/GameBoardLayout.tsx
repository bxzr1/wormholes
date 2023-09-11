import React from 'react';
import { BoardPieceLayout } from './BoardPieceLayout';
import { BoardPiece } from './BoardPiece';
import { template } from './template';


export function GameBoard() {
    const boardPieceArray: BoardPiece[] = template.map((description, index) => {
        return new BoardPiece(index, description);
    });
    const spaceStation = boardPieceArray[0];

    return (
        <div className='gameBoard'>
            { boardPieceArray.map( ( piece ) => { 
                return <BoardPieceLayout boardPiece={ piece }/>
            }) }
        </div>
    )
}