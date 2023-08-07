import React, { useEffect, useState, useMemo } from 'react';
import { HexNode } from './HexNode';
import { NodeType, template } from './template';
import { BoardPiece } from './BoardPiece';


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
        <div>
            {nodes.map(hex => {
                const isClicked = hex.getId() === clicked;
                const isNeighbor = neighbors.includes(nodes[hex.getId()]);
                return (
                <div style={ {
                     color: 'white', 
                     border: '1px solid blue', 
                     height: 20, 
                     width: 200, 
                     margin: 8, 
                     padding: 10, 
                     display: 'flex',
                     flexDirection: "column",
                     cursor: hex.getNodeType() === NodeType.unreachable ? 'not-allowed' : "pointer",
                     backgroundColor:  hex.getNodeType() === NodeType.unreachable ? "grey" : 
                        isClicked ? 'blue' : 
                        isNeighbor ? 'green' : 'red'}} 
                     onClick={() => setClicked(hex.getId())}>
                    {`id: ${hex.getId()}`}
                    {hex.getPlanetName()}
                    {`nodeType: ${hex.getNodeType()}`}
                </div>)
            })}
        </div>
    )
}