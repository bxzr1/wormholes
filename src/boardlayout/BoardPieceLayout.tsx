import React from 'react';
import { HexPiece } from './HexNodeLayout';
import { BoardPiece_t, GetRotatedNodeAtIndex } from '../utils/boardpieceutils';
import { HexLocation_t } from '../utils/hexnodeutils';
import styles from './GameBoardStyles.module.scss';
import { selectHexNode } from '../reducers/BoardReducer';
import { useSelector } from 'react-redux';
import { GridNodeIndex_t } from '../utils/aliasutils';

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
    selectedLocation: HexLocation_t | null, 
}) => {
    const { boardPiece, selectedLocation } = props;
    const nodeKeys = Object.keys( boardPiece.nodes ); 
    const selectedNode = useSelector( selectHexNode( selectedLocation ) );

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
                    const isClicked = selectedLocation && node.hexNodeIndex === selectedLocation.hexNodeIndex && boardPiece.boardPieceIndex === selectedLocation.boardPieceIndex;
                    const isNeighborOfSelected = selectedNode ? selectedNode.neighbors.findIndex(( neighbor ) => neighbor.location.boardPieceIndex === boardPiece.boardPieceIndex && neighbor.location.hexNodeIndex === node.hexNodeIndex ) > -1 : false;
                    return <HexPiece
                        boardPieceIndex={ boardPiece.boardPieceIndex }
                        node={ node }
                        gridID={ gridNode } 
                        isNeighbor={ isNeighborOfSelected }
                        isSelected={ !!isClicked }
                        key={ node.hexNodeIndex }
                        boardPieceRotation={ boardPiece.rotation }
                />
                })
            }
        </div>
    )
}