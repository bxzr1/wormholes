import { spaceImages, nebulaImages, asteroidImages, sunImages, stationImages, cannonImage, planetImages } from "../image_assets/images";
import { NodeType, PlanetTypes } from "../template";

export interface HexNode_t {
    nodeID: number,
    nodeType: NodeType,
    neighborLocations: HexLocation_t[],
    isPlanet: boolean, 
    planetName?: PlanetTypes,
    hexNodeCenterX?: number,
    hexNodeCenterY?: number,
}

export interface HexLocation_t {
    boardPieceID: number, 
    hexNodeID: number,
}

export function GenerateNodeBackground(nodeType: NodeType, name?: PlanetTypes): string {
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

export function FindNodeGridPosition(index: number): { row: number, column: number } {
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