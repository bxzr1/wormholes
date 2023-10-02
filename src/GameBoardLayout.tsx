import React, { useState } from 'react';
import { BoardPieceLayout } from './BoardPieceLayout';
import { BoardPiece } from './BoardPiece';
import { HexNode } from './HexNode';
import { template } from './template';

export function GameBoardLayout( props: { gameBoardPieces: BoardPiece[] } ) {

    const [ clicked, setClicked ] = useState<HexNode>();

    return (
        <div className='gameBoard grid-container-gameboard'>
            { props.gameBoardPieces.map( ( piece, index ) => { 
                return <BoardPieceLayout boardPiece={ piece } clicked={ clicked } setClicked={ setClicked } key={ index }/>
            }) }
        </div>
    )
}