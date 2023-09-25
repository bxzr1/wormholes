import React, { useState, useMemo } from 'react';
import { HexPiece } from './HexNodeLayout';
import { BoardPiece, rotationLookup } from './BoardPiece';
import { HexNode } from './HexNode';
import './BoardStyle.css';

const rowAndColumn = [
    { row: 27, column: 1 },
    { row: 10, column: 0 },
    { row: 1, column: 7 },
    { row: 15, column: 8 },
    { row: 32, column: 9 },
    { row: 49, column: 10 },
    { row: 39, column: 17 },
    { row: 22, column: 16 },
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
                gridColumn: `col ${rowAndColumn[boardPiece.getId()].column} / span 10`,
                gridRow: `row ${rowAndColumn[boardPiece.getId()].row} / span 16`} } >
            {nodes.map((hex) => {
                const id = hex.getId();
                const isClicked = hex === clicked;
                const isNeighbor = neighbors.includes(nodes[id]);
                const lookupId = rotationLookup[id];
                const nodeID = lookupId[boardPiece.getRotation()];
                const lookup = nodes[nodeID];
                return <HexPiece 
                    hex={ lookup } // hex={rotationLookup[hex.getId()][boardPiece.rotation]}
                    hexId = { hex.getId() } 
                    isNeighbor={ isNeighbor }
                    isClicked={ isClicked }
                    setClicked={ setClicked }
                />
            })}
        </div>
    )
}