import { spaceImages, nebulaImages, asteroidImages, sunImages, stationImages, cannonImage, planetImages } from "../image_assets/images";
import { NodeType, PlanetTypes } from "../template";
import { HexNodeIndex_t, ConnectionDirection_t, BoardPieceIndex_t, GridNodeIndex_t } from "./aliasutils";

export interface HexNode_t {
    hexNodeIndex: HexNodeIndex_t,
    nodeType: NodeType,
    neighbors: HexNodeNeighbor_t[],
    isPlanet: boolean, 
    planetName?: PlanetTypes,
    hexNodeCenterX?: number,
    hexNodeCenterY?: number,
}

export interface HexNodeNeighbor_t 
{
    location: HexLocation_t,
    connectionDirection?: ConnectionDirection_t,
}

export interface HexLocation_t {
    boardPieceIndex: BoardPieceIndex_t, 
    hexNodeIndex: HexNodeIndex_t,
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

export function FindNodeGridPosition( nodeIndex: GridNodeIndex_t ): { row: number, column: number } {
    if (nodeIndex < 3)
        return { row: 1, column: 3 + nodeIndex * 2 };
    else if (nodeIndex < 7)
        return { row: 4, column: 2 + (nodeIndex - 3)*2 };
    else if (nodeIndex < 12)
        return { row: 7, column: 1 + (nodeIndex - 7)*2 };
    else if (nodeIndex < 16)
        return { row: 10, column: 2 + (nodeIndex - 12)*2 };
    else
        return { row: 13, column: 3 + (nodeIndex - 16)*2 };
}