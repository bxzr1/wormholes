import React from 'react';
import { BoardPieceLayout } from './BoardPieceLayout';
import { BoardPieceMap_t } from '../utils/gameboardutils';
import styles from './GameBoardStyles.module.scss';

export function GameBoardLayout( props: { gameBoardPieces: BoardPieceMap_t } ) 
{
    const { gameBoardPieces } = props;

    return (
        <div className={ styles.GridContainerGameboard }>
            { Object.values( gameBoardPieces ).map( ( piece, index ) => { 
                return <BoardPieceLayout 
                            boardPiece={ piece } 
                            key={ index }
                        />
            }) }
        </div>
    )
}