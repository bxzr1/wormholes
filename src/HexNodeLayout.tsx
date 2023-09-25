import { useEffect, useState } from 'react'
import { HexNode } from './HexNode';
import { spaceImages } from './image_assets/images';

function findRowAndColumn(index: number): { row: number, column: number } {
    if(index < 3)
        return { row: 1, column: 2 + index * 2 };
    else if(index < 7)
        return { row: 4, column: 1 + (index - 3)*2 };
    else if (index < 12)
        return { row: 7, column: (index - 7)*2 };
    else if(index < 16)
        return { row: 10, column: 1 + (index - 12)*2 };
    else
        return { row: 13, column: 2 + (index - 16)*2 };
}

export function HexPiece( props: { 
    hex: HexNode, isClicked: boolean, 
    isNeighbor: boolean,
    hexId: number,
    setClicked: ( hex: HexNode )=> void 
}) {
    const { hex, isClicked, isNeighbor, setClicked } = props; 
    const [ imgRandomizer, setImgRandomizer ] = useState<number>( () => Math.floor(Math.random() * 2)); // 0-2 inclusive
    
    const id = hex.getId();
    const { row, column } = findRowAndColumn(props.hexId);
    const imgSrc = hex.getNodeType() === 'space' ? spaceImages[ imgRandomizer ] : ""
    const className = `hex ${isClicked ? 'is-clicked' : ''} ${isNeighbor ? 'is-neighbor' : ''} ${hex.getNodeType()}`;

    return (
        <div className={className}
            style={ {
                gridColumn: `col ${column} / span 2`,
                gridRow: `row ${row} / span 4`} } 
            onClick={() => setClicked( hex )}>
            <p className='display-on-top' >
                {`id: ${id}`}
                {hex.getPlanetName()}
            </p>
            <img className='hex-background' src={ imgSrc }></img>

        </div>
    ) 
}