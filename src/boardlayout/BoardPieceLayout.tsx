import React from 'react';
import { HexPiece } from './HexNodeLayout';
import { BoardPiece_t, GetRotatedNodeAtIndex } from '../utils/boardpieceutils';
import styles from './GameBoardStyles.module.scss';
import { GridNodeIndex_t } from '../utils/aliasutils';
import { selectCurrentPlayer } from '../reducers/PlayerReducer';
import { useSelector } from 'react-redux';
import { selectHexNodeMoveableNeighborCosts } from '../reducers/BoardReducer';

const rowAndColumn = [
    { row: 25, column: 2 },
    { row: 10, column: 1 },
    { row: 1, column: 8 },
    { row: 16, column: 9 },
    { row: 31, column: 10 },
    { row: 46, column: 11 },
    { row: 37, column: 18 },
    { row: 22, column: 17 },
]

export const BoardPieceLayout = (props: { 
    boardPiece: BoardPiece_t,
}) => {
    const { boardPiece } = props;
    const nodeKeys = Object.keys( boardPiece.nodes );
    const currentPlayer = useSelector( selectCurrentPlayer )
    const mapNeighborCosts = useSelector( selectHexNodeMoveableNeighborCosts( currentPlayer?.hexLocation ?? null, currentPlayer?.fuelLeft ?? 0 ) )

    return (
        <div className={styles.GridContainerBoardPiece }
            style={ {
                gridRowStart: rowAndColumn[boardPiece.boardPieceIndex ].row,
                gridColumnStart: rowAndColumn[boardPiece.boardPieceIndex].column,
                gridRowEnd: 'span 15',
                gridColumnEnd: 'span 10'
            } } >
            { nodeKeys.map(( gridID ) => 
                {
                    const gridNode = parseInt( gridID ) as GridNodeIndex_t;
                    const node = GetRotatedNodeAtIndex( gridNode, boardPiece );
                    const fuelCost = mapNeighborCosts[ boardPiece.boardPieceIndex ] ? mapNeighborCosts[ boardPiece.boardPieceIndex ][node.hexNodeIndex] : undefined
                    return <HexPiece
                        boardPieceIndex={ boardPiece.boardPieceIndex }
                        node={ node }
                        gridID={ gridNode } 
                        fuelCost={ fuelCost }
                        key={ node.hexNodeIndex }
                        boardPieceRotation={ boardPiece.rotation }
                />
                })
            }
        </div>
    )
}