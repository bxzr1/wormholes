import React, { useState } from 'react';
import { BoardPieceLayout } from './BoardPieceLayout';
import { HexLocation_t } from '../utils/hexnodeutils';
import { BoardPieceMap_t } from '../utils/gameboardutils';
import styles from './GameBoardStyles.module.scss';

export function GameBoardLayout( props: { gameBoardPieces: BoardPieceMap_t } ) 
{
    const { gameBoardPieces } = props;
    const [ selectedLocation, setSelectedLocation ] = useState<HexLocation_t>();

    return (
        <div className={ styles.GridContainerGameboard }>
            { Object.values( gameBoardPieces ).map( ( piece, index ) => { 
                return <BoardPieceLayout boardPiece={ piece } selectedLocation={ selectedLocation } setSelectedLocation={ setSelectedLocation } key={ index }/>
            }) }
        </div>
    )
}