import React, { useState } from 'react';
import { BoardPieceLayout } from './BoardPieceLayout';
import { HexLocation_t } from '../utils/hexnodeutils';
import { BoardPieceMap_t } from '../utils/gameboardutils';
import styles from './GameBoardStyles.module.scss';
import { useSelector } from 'react-redux';
import { selectCurrentPlayer } from '../reducers/PlayerReducer';

export function GameBoardLayout( props: { gameBoardPieces: BoardPieceMap_t } ) 
{
    const { gameBoardPieces } = props;
    const currentPlayer = useSelector( selectCurrentPlayer );

    return (
        <div className={ styles.GridContainerGameboard }>
            { Object.values( gameBoardPieces ).map( ( piece, index ) => { 
                return <BoardPieceLayout 
                            boardPiece={ piece } 
                            selectedLocation={ currentPlayer ? currentPlayer.hexLocation : null } 
                            key={ index }
                        />
            }) }
        </div>
    )
}