import { HexNode_t, HexNodeNeighbor_t } from "./hexnodeutils";
import { NodeDescription, NodeType, isUnreachable } from "../template";
// see image-references -> board_scheme for details
const neighborsMap: { [index: number]: { orientation: number, neighborIndex: number }[] } = {
    0: 
    [
        { orientation: 1, neighborIndex: 1 },
        { orientation: 2, neighborIndex: 4 },
        { orientation: 3, neighborIndex: 3 },
    ],
    1: 
    [
        { orientation: 1, neighborIndex: 2 },
        { orientation: 2, neighborIndex: 5 },
        { orientation: 3, neighborIndex: 4 }, 
        { orientation: 4, neighborIndex: 0 },
    ],
    2: 
    [
        { orientation: 2, neighborIndex: 6},
        { orientation: 3, neighborIndex: 5 },
        { orientation: 4, neighborIndex: 1 },
    ],
    3: 
    [
        { orientation: 0, neighborIndex: 0 },
        { orientation: 1, neighborIndex: 4 },
        { orientation: 2, neighborIndex: 8 },
        { orientation: 3, neighborIndex: 7 }, 
    ],
    4: 
    [
        { orientation: 0, neighborIndex: 1 },
        { orientation: 4, neighborIndex: 3 }, 
        { orientation: 1, neighborIndex: 5 },
        { orientation: 3, neighborIndex: 8 },
        { orientation: 2, neighborIndex: 9 },
        { orientation: 5, neighborIndex: 0 },
    ],
    5: 
    [
        { orientation: 0, neighborIndex: 2 },
        { orientation: 4, neighborIndex: 4 }, 
        { orientation: 1, neighborIndex: 6 },
        { orientation: 3, neighborIndex: 9 },
        { orientation: 2, neighborIndex: 10 },
        { orientation: 5, neighborIndex: 1 },
    ],
    6: 
    [   
        { orientation: 2, neighborIndex: 11 },
        { orientation: 3, neighborIndex: 10 },
        { orientation: 4, neighborIndex: 5 }, 
        { orientation: 5, neighborIndex: 2 },
    ],
    7: 
    [
        { orientation: 0, neighborIndex: 3 },
        { orientation: 1, neighborIndex: 8 },
        { orientation: 2, neighborIndex: 12 }, 
    ],
    8: 
    [
        { orientation: 0, neighborIndex: 4 },
        { orientation: 1, neighborIndex: 9 }, 
        { orientation: 2, neighborIndex: 13 },
        { orientation: 3, neighborIndex: 12 },
        { orientation: 4, neighborIndex: 7 },
        { orientation: 5, neighborIndex: 3 },
    ],
    9: 
    [
        { orientation: 0, neighborIndex: 5 },
        { orientation: 1, neighborIndex: 10 }, 
        { orientation: 2, neighborIndex: 14 },
        { orientation: 3, neighborIndex: 13 },
        { orientation: 4, neighborIndex: 8 },
        { orientation: 5, neighborIndex: 4 },
    ],
    10: 
    [
        { orientation: 0, neighborIndex: 6 },
        { orientation: 1, neighborIndex: 11 }, 
        { orientation: 2, neighborIndex: 15 },
        { orientation: 3, neighborIndex: 14 },
        { orientation: 4, neighborIndex: 9 },
        { orientation: 5, neighborIndex: 5 },
    ],
    11: 
    [
        { orientation: 3, neighborIndex: 15 },
        { orientation: 4, neighborIndex: 10 },
        { orientation: 5, neighborIndex: 6 },
    ],
    12: 
    [
        { orientation: 0, neighborIndex: 8 },
        { orientation: 1, neighborIndex: 13 }, 
        { orientation: 2, neighborIndex: 16 },
    ],
    13: 
    [
        { orientation: 0, neighborIndex: 9 },
        { orientation: 1, neighborIndex: 14 }, 
        { orientation: 2, neighborIndex: 17 },
        { orientation: 3, neighborIndex: 16 },
        { orientation: 4, neighborIndex: 12 },
        { orientation: 5, neighborIndex: 8 },
    ],
    14: 
    [
        { orientation: 0, neighborIndex: 10 },
        { orientation: 1, neighborIndex: 15 }, 
        { orientation: 2, neighborIndex: 18 },
        { orientation: 3, neighborIndex: 17 },
        { orientation: 4, neighborIndex: 13 },
        { orientation: 5, neighborIndex: 9 },
    ],
    15: 
    [
        { orientation: 0, neighborIndex: 11 },
        { orientation: 3, neighborIndex: 18 },
        { orientation: 4, neighborIndex: 14 },
        { orientation: 5, neighborIndex: 10 },
    ],
    16: 
    [
        { orientation: 0, neighborIndex: 13 },
        { orientation: 1, neighborIndex: 17 }, 
        { orientation: 5, neighborIndex: 12 },
    ],
    17: 
    [
        { orientation: 0, neighborIndex: 14 },
        { orientation: 1, neighborIndex: 18 }, 
        { orientation: 4, neighborIndex: 16 },
        { orientation: 5, neighborIndex: 13 },
    ],
    18: 
    [
        { orientation: 0, neighborIndex: 15 },
        { orientation: 4, neighborIndex: 17 },
        { orientation: 5, neighborIndex: 14 },
    ],
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
            neighbors: []
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
    const orbitNodes = nodes.filter( ( nodes ) => nodes.nodeType === NodeType.orbit );
    nodes.forEach((node, index) =>
    {
        const neighborData = neighborsMap[index];
        const nodeNeighbors: HexNodeNeighbor_t[] = [];

        neighborData.forEach( ( neighborData ) => 
        {
            const neighborNode = nodes[neighborData.neighborIndex];
            if( !isUnreachable( neighborNode.nodeType ))
            {
                nodeNeighbors.push({ location: { boardPieceID, hexNodeID: neighborNode.nodeID }, orientation: neighborData.orientation } )
            }
        });

        if( node.nodeType === NodeType.orbit )
        {
            orbitNodes.forEach( ( orbitNode ) => 
            {
                if( nodeNeighbors.findIndex( ( neighbor ) => neighbor.location.hexNodeID === orbitNode.nodeID ) > -1 )
                    return;
                else if ( orbitNode.nodeID === node.nodeID ) 
                    return;
                else 
                nodeNeighbors.push( { location: { boardPieceID, hexNodeID: orbitNode.nodeID }, orientation: undefined } );
            })
        }

        newNodes[ node.nodeID ] = {
            ...node,
            neighbors: nodeNeighbors
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

export function GetBoardPieceEdgeInfo( boardPiece: BoardPiece_t, requestedEdgeIndex: number ): { nodeIndices: number[], edgeIndex: number}
{
    const actualEdgeIndex = (requestedEdgeIndex + boardPiece.rotation) % 6;
    return { nodeIndices: edgesMap[actualEdgeIndex], edgeIndex: actualEdgeIndex };
}

export function GetRotatedNodeAtID( sourceNodeID: number, boardPiece: BoardPiece_t )
{
    const lookupId = rotationLookup[sourceNodeID];
    const nodeID = lookupId[boardPiece.rotation];
    const rotatedNode = boardPiece.nodes[nodeID];
    return rotatedNode;
}