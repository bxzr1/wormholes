import { NodeType, PlanetTypes, isUnreachable } from "../template";

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