import { useState, useRef, useLayoutEffect } from 'react'
import { HexNode } from './HexNode';
import { NodeType } from './template';
import { PlanetTypes} from './template';
import { spaceImages } from './image_assets/images';
import { nebulaImages } from './image_assets/images';
import { asteroidImages } from './image_assets/images';
import { cannonImage } from './image_assets/images';
import { sunImages } from './image_assets/images';
import { stationImages } from './image_assets/images';
import { planetImages } from './image_assets/images';

function findRowAndColumn(index: number): { row: number, column: number } {
    if (index < 3)
        return { row: 1, column: 3 + index * 2 };
    else if (index < 7)
        return { row: 4, column: 2 + (index - 3)*2 };
    else if (index < 12)
        return { row: 7, column: 1 + (index - 7)*2 };
    else if (index < 16)
        return { row: 10, column: 2 + (index - 12)*2 };
    else
        return { row: 13, column: 3 + (index - 16)*2 };
}

function generateBackgrounds(nodeType: NodeType, name?: PlanetTypes): string {
    if(nodeType === NodeType.space)
        return spaceImages[ Math.floor(Math.random() * (spaceImages.length)) ];
    
    else if(nodeType === NodeType.nebula)
        return nebulaImages[ Math.floor(Math.random() * (nebulaImages.length)) ];

    else if(nodeType === NodeType.asteroid)
        return asteroidImages[ Math.floor(Math.random() * (asteroidImages.length)) ];
    
    else if(nodeType === NodeType.star)
        return sunImages[ Math.floor(Math.random() * (sunImages.length)) ];
    
    else if(nodeType === NodeType.station)
        return stationImages[0];
    
    else if(nodeType === NodeType.orbit)
        return stationImages[1];

    else if(nodeType === NodeType.cannon)
        return cannonImage[ Math.floor(Math.random() * (cannonImage.length)) ];

    else if(nodeType === NodeType.planet && name)
        return planetImages[name];

    else
        return "";
}

export function HexPiece( props: { 
    hex: HexNode, isClicked: boolean, 
    isNeighbor: boolean,
    hexId: number,
    setClicked: ( hex: HexNode )=> void 
}) {
    const { hex, isClicked, isNeighbor, setClicked } = props;
    const [ imgUrl ] = useState<string>( () => generateBackgrounds(hex.getNodeType(), hex.getPlanetName()));  
    const id = hex.getId();
    const { row, column } = findRowAndColumn(props.hexId);
    const className = `hex ${isClicked ? 'is-clicked' : ''} ${isNeighbor ? 'is-neighbor' : ''} ${hex.getNodeType()}`;
    const hexNodeDiv = useRef<HTMLDivElement>(null);
    
    useLayoutEffect(() => {
        const boundingRectangle = hexNodeDiv?.current?.getBoundingClientRect();
        if (boundingRectangle === undefined) {
            return;
        }

        hex.hexNodeCenterX = boundingRectangle.x + boundingRectangle.width/2;
        hex.hexNodeCenterY = boundingRectangle.y + boundingRectangle.height/2;
    }, [hex]);

    return (
        <div className={className}
            ref={hexNodeDiv}  
            style={ {
                gridRowStart: row,
                gridColumnStart: column,
                gridRowEnd: 'span 4',
                gridColumnEnd: 'span 2'
             } } 
            onClick={() => setClicked( hex )}>
            <p className='display-on-top' >
                {`id: ${id}`}
                {hex.getPlanetName()}
            </p>
            <img className='hex-background' src={ imgUrl } alt=''></img>
        </div>
    ) 
}