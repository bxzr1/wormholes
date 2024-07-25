import { HexNode_t } from "./HexNode";
import { NodeDescription, isUnreachable } from "../template";

const neighborsMap: { [index: number]: number[] } = {
    0: [1,3,4],
    1: [0,2,4,5],
    2: [1,5,6],
    3: [0,4,7,8],
    4: [0,1,3,5,8,9],
    5: [1,2,4,6,9,10],
    6: [2,5,10,11],
    7: [3,8,12],
    8: [3,4,7,9,12,13],
    9: [4,5,8,10,13,14],
    10: [5,6,9,11,14,15],
    11: [6,10,15],
    12: [7,8,13,16],
    13: [8,9,12,14,16,17],
    14: [9,10,13,15,17,18],
    15: [10,11,14,18],
    16: [12,13,17],
    17: [13,14,16,18],
    18: [14,15,17]
};

const edgesMap: { [index: number]: number[] } = {
    0: [0, 1, 2],
    1: [2, 6, 11],
    2: [11, 15, 18],
    3: [18, 17, 16],
    4: [16, 12, 7],
    5: [7, 3, 0],
}

export const rotationLookup: { [index: number]: number[] } = {
    
    // Clockwise table
    0:[0, 2, 11, 18, 16, 7],
    1:[1, 6, 15, 17, 12, 3],
    2:[2, 11, 18, 16, 7, 0],
    3:[3, 1, 6, 15, 17, 12],
    4:[4, 5, 10, 14, 13, 8],
    5:[5, 10, 14, 13, 8, 4],
    6:[6, 15, 17, 12, 3, 1],
    7:[7, 0, 2, 11, 18, 16],
    8:[8, 4, 5, 10, 14, 13],
    9:[9, 9, 9, 9, 9, 9, 9],
    10:[10, 14, 13, 8, 4, 5],
    11:[11, 18, 16, 7, 0, 2],
    12:[12, 3, 1, 6, 15, 17],
    13:[13, 8, 4, 5, 10, 14],
    14:[14, 13, 8, 4, 5, 10],
    15:[15, 17, 12, 3, 1, 6],
    16:[16, 7, 0, 2, 11, 18],
    17:[17, 12, 3, 1, 6, 15],
    18:[18, 16, 7, 0, 2, 11]
    
    /*
    // Counter-clockwise table
    0:[7, 16, 18, 11, 2, 0],
    1:[3, 12, 17, 15, 6, 1],
    2:[0, 7, 16, 18, 11, 2],
    3:[12, 17, 15, 6, 1, 3],
    4:[8, 13, 14, 10, 5, 4],
    5:[4, 8, 13, 14, 10, 5],
    6:[1, 3, 12, 17, 15, 6],
    7:[16, 18, 11, 2, 0, 7],
    8:[13, 14, 10, 5, 4, 8],
    9:[9, 9, 9, 9, 9, 9, 9],
    10:[5,4,8,13,14,10],
    11:[2,0,7,16,18,11],
    12:[17,15,6,1,3,12],
    13:[14,10,5,4,8,13],
    14:[10,5,4,8,13,14],
    15:[6,1,3,12,17,15],
    16:[18,11,2,0,7,16],
    17:[15,6,1,3,12,17],
    18:[11,2,0,7,16,18]
    */
}

export interface NodeMap_t { [ hexNodeID: number ]: HexNode_t };

export interface BoardPiece_t 
{
    boardPieceID: number,
    nodes: { [ hexNodeID: number ] : HexNode_t },
    rotation: number,
    templateIndex: number,
}

export function CreateBoardPiece( boardPieceID: number, templateIndex: number, templateNodes: NodeDescription[] )
{
    let nodes: HexNode_t[] = templateNodes.map( ( templateNode, nodeIndex ) => {
        return {
            nodeID: nodeIndex,
            nodeType: templateNode.type,
            isPlanet: templateNode.name ? true : false , 
            planetName: templateNode.name,
            neighborLocations: []
        }
    });
    const nodesWithNeighbors = SetNodeNeighbors( nodes, boardPieceID );

    return {
        boardPieceID, 
        templateIndex,
        rotation: Math.floor(Math.random() * 5),
        nodes: nodesWithNeighbors
    }

}

function SetNodeNeighbors( nodes: HexNode_t[], boardPieceID: number )
{
    let newNodes: NodeMap_t = {};
    nodes.forEach((node, index) =>
    {
        const neighborIndicies = neighborsMap[index];
        const mappedIndicies = neighborIndicies.map((neighborIndex) => {
            return nodes[neighborIndex]
        });

        const reachableNeighbors = mappedIndicies.filter((hexNode) => {
            return !isUnreachable(hexNode.nodeType );
        });

        newNodes[ node.nodeID ] = {
            ...node,
            neighborLocations: reachableNeighbors.map( ( neighbor ) => { return { boardPieceID, hexNodeID: neighbor.nodeID } })
        }
    });

    return newNodes;
};

export function GetRotatedBoardPiece( boardPiece: BoardPiece_t )
{
    return {
        ...boardPiece,
        rotation: ( boardPiece.rotation + 1) % 6
    }
}

export function GetBoardPieceEdgeIndices( boardPiece: BoardPiece_t, requestedEdgeIndex: number ): number[]
{
    const actualEdgeIndex = (requestedEdgeIndex + boardPiece.rotation) % 6;
    return edgesMap[actualEdgeIndex];
}

export function GetRotatedNodeAtID( sourceNodeID: number, boardPiece: BoardPiece_t )
{
    const lookupId = rotationLookup[sourceNodeID];
    const nodeID = lookupId[boardPiece.rotation];
    const rotatedNode = boardPiece.nodes[nodeID];
    return rotatedNode;
}