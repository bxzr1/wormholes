import React from 'react';
import { HexPiece } from './HexNodeLayout';
import { BoardPiece_t } from '../gameboard/BoardPiece';
import { HexLocation_t } from '../gameboard/HexNode';
import './BoardStyle.css';
import { selectHexNode } from '../reducers/BoardReducer';
import { useSelector } from 'react-redux';

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
    selectedLocation: HexLocation_t | undefined, 
    setSelectedLocation: ( hex: HexLocation_t ) => void 
}) => {
    const { boardPiece, selectedLocation, setSelectedLocation } = props;
    const selectedNode = useSelector( selectHexNode( selectedLocation ) );

    return (
        <div className='grid-container-boardpiece'
            style={ {
                gridRowStart: rowAndColumn[boardPiece.boardPieceID ].row,
                gridColumnStart: rowAndColumn[boardPiece.boardPieceID].column,
                gridRowEnd: 'span 15',
                gridColumnEnd: 'span 10',
                transform: `rotate(${ boardPiece.rotation * -60}deg)`,
            } } >
            {Object.values( boardPiece.nodes ).map(( node ) => {
                const isClicked = selectedLocation && node.nodeID === selectedLocation.hexNodeID && boardPiece.boardPieceID === selectedLocation.boardPieceID;
                const isNeighborOfSelected = selectedNode ? selectedNode.neighborLocations.findIndex(( neighbor ) => neighbor.boardPieceID === boardPiece.boardPieceID && neighbor.hexNodeID === node.nodeID ) > -1 : false;
                return <HexPiece
                    boardPieceID={ boardPiece.boardPieceID }
                    node={ node }
                    hexId = { node.nodeID } 
                    isNeighbor={ isNeighborOfSelected }
                    isSelected={ !!isClicked }
                    setSelectedLocation={ setSelectedLocation }
                    key={ node.nodeID }
                    boardPieceRotation={ boardPiece.rotation }
                />
            })}
        </div>
    )
}