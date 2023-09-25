import React, { useState, useMemo } from 'react';
import { HexPiece } from './HexNodeLayout';
import { BoardPiece, rotationLookup } from './BoardPiece';
import { HexNode } from './HexNode';
import './BoardStyle.css';

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

export const BoardPieceLayout = (props: {boardPiece: BoardPiece, clicked: HexNode | undefined, setClicked: (hex: HexNode) => void}) => {
    const { boardPiece, clicked, setClicked } = props;
    const nodes = React.useMemo( () => { 
        return boardPiece.getNodes();
    }, [ boardPiece ])
    
    const neighbors = useMemo(() => {
        if (clicked) 
            return clicked.getNeighbors();
        else return [];
    }, [clicked, nodes]);

    return (
        <div className='grid-container-boardpiece'
            style={ {
                gridRowStart: rowAndColumn[boardPiece.getId()].row,
                gridColumnStart: rowAndColumn[boardPiece.getId()].column,
                gridRowEnd: 'span 15',
                gridColumnEnd: 'span 10',
                transform: `rotate(${ boardPiece.getRotation() * -60}deg)`,
            } } >
            {nodes.map((hex) => {
                const id = hex.getId();
                const lookupId = rotationLookup[id];
                const nodeID = lookupId[boardPiece.getRotation()];
                const lookup = nodes[nodeID];
                const isClicked = hex === clicked;
                const isNeighbor = neighbors.includes(hex);
                return <HexPiece 
                    hex={ hex } // hex={rotationLookup[hex.getId()][boardPiece.rotation]}
                    hexId = { hex.getId() } 
                    isNeighbor={ isNeighbor }
                    isClicked={ isClicked }
                    setClicked={ setClicked }
                    rotation={ boardPiece.getRotation() }
                />
            })}
        </div>
    )
}