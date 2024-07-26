import React, { useState } from 'react';
import { BoardPieceLayout } from './BoardPieceLayout';
import { HexLocation_t } from '../gameboard/HexNode';
import { BoardPieceMap_t } from '../gameboard/GameBoard';

export function GameBoardLayout( props: { gameBoardPieces: BoardPieceMap_t } ) 
{
    const { gameBoardPieces } = props;
    const [ selectedLocation, setSelectedLocation ] = useState<HexLocation_t>();

    return (
        <div className='gameBoard grid-container-gameboard'>
            { Object.values( gameBoardPieces ).map( ( piece, index ) => { 
                return <BoardPieceLayout boardPiece={ piece } selectedLocation={ selectedLocation } setSelectedLocation={ setSelectedLocation } key={ index }/>
            }) }
        </div>
    )
}