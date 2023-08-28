import React, { useEffect, useState, useMemo } from 'react';
import { HexNode } from './HexNode';
import { NodeType, template } from './template';
import { BoardPiece } from './BoardPiece';
import './BoardStyle.css';

function findRowAndColumn(index: number): { row: number, column: number } {
    if(index < 3)
        return { row: 1, column: 3 + index * 2 };
    else if(index < 7)
        return { row: 4, column: 2 + (index - 3)*2 };
    else if (index < 12)
        return { row: 7, column: 1 + (index - 7)*2 };
    else if(index < 16)
        return { row: 10, column: 2 + (index - 12)*2 };
    else
        return { row: 13, column: 3 + (index - 16)*2 };
}

export const BoardPieceLayout = (props: {boardPiece: BoardPiece}) => {
    const { boardPiece } = props;
    const [ clicked, setClicked ] = useState<number>();
    const nodes = React.useMemo( () => { 
        return boardPiece.getNodes();
    }, [ boardPiece ])
    
    const neighbors = useMemo(() => {
        if (clicked === 0 || clicked) 
            return nodes[clicked].getNeighbors();
        else return [];
    }, [clicked]);
    
    return (
        <div className='grid-container'>
            {nodes.map((hex) => {
                const id = hex.getId();
                const { row, column } = findRowAndColumn(id);
                const isClicked = id === clicked;
                const isNeighbor = neighbors.includes(nodes[id]);
                const className = `hex ${isClicked ? 'is-clicked' : ''} ${isNeighbor ? 'is-neighbor' : ''} ${hex.getNodeType()}`;

                return (
                <div className={className} 
                     style={ {
                        gridColumn: `col ${column} / span 2`,
                        gridRow: `row ${row} / span 4`} } 
                     onClick={() => setClicked(id)}>
                    {`id: ${id}`}
                    {hex.getPlanetName()}
                </div>)
            })}
        </div>
    )
}