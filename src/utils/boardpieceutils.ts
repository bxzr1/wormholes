import { ConnectionDirection_t, HexNode_t, HexNodeIndex_t, HexNodeNeighbor_t } from "./hexnodeutils";
import { NodeDescription, NodeType } from "../template";
import { debugLinearRotations } from "./debugutils";

export type EdgeIndex_t = number; 
export type EdgeNodeIndex_t = number;
export type BoardPieceIndex_t = number; 

// see hexnode_diagram under image-references/indexandnamingdiagram for more details
const neighborsMap: { [sourceHexNodeIndex: HexNodeIndex_t]: { connectionDirection: ConnectionDirection_t, neighborHexNodeIndex: HexNodeIndex_t }[] } = {
    0: 
    [
        { connectionDirection: 1, neighborHexNodeIndex: 1 },
        { connectionDirection: 2, neighborHexNodeIndex: 4 },
        { connectionDirection: 3, neighborHexNodeIndex: 3 },
    ],
    1: 
    [
        { connectionDirection: 1, neighborHexNodeIndex: 2 },
        { connectionDirection: 2, neighborHexNodeIndex: 5 },
        { connectionDirection: 3, neighborHexNodeIndex: 4 }, 
        { connectionDirection: 4, neighborHexNodeIndex: 0 },
    ],
    2: 
    [
        { connectionDirection: 2, neighborHexNodeIndex: 6},
        { connectionDirection: 3, neighborHexNodeIndex: 5 },
        { connectionDirection: 4, neighborHexNodeIndex: 1 },
    ],
    3: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 0 },
        { connectionDirection: 1, neighborHexNodeIndex: 4 },
        { connectionDirection: 2, neighborHexNodeIndex: 8 },
        { connectionDirection: 3, neighborHexNodeIndex: 7 }, 
    ],
    4: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 1 },
        { connectionDirection: 4, neighborHexNodeIndex: 3 }, 
        { connectionDirection: 1, neighborHexNodeIndex: 5 },
        { connectionDirection: 3, neighborHexNodeIndex: 8 },
        { connectionDirection: 2, neighborHexNodeIndex: 9 },
        { connectionDirection: 5, neighborHexNodeIndex: 0 },
    ],
    5: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 2 },
        { connectionDirection: 4, neighborHexNodeIndex: 4 }, 
        { connectionDirection: 1, neighborHexNodeIndex: 6 },
        { connectionDirection: 3, neighborHexNodeIndex: 9 },
        { connectionDirection: 2, neighborHexNodeIndex: 10 },
        { connectionDirection: 5, neighborHexNodeIndex: 1 },
    ],
    6: 
    [   
        { connectionDirection: 2, neighborHexNodeIndex: 11 },
        { connectionDirection: 3, neighborHexNodeIndex: 10 },
        { connectionDirection: 4, neighborHexNodeIndex: 5 }, 
        { connectionDirection: 5, neighborHexNodeIndex: 2 },
    ],
    7: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 3 },
        { connectionDirection: 1, neighborHexNodeIndex: 8 },
        { connectionDirection: 2, neighborHexNodeIndex: 12 }, 
    ],
    8: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 4 },
        { connectionDirection: 1, neighborHexNodeIndex: 9 }, 
        { connectionDirection: 2, neighborHexNodeIndex: 13 },
        { connectionDirection: 3, neighborHexNodeIndex: 12 },
        { connectionDirection: 4, neighborHexNodeIndex: 7 },
        { connectionDirection: 5, neighborHexNodeIndex: 3 },
    ],
    9: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 5 },
        { connectionDirection: 1, neighborHexNodeIndex: 10 }, 
        { connectionDirection: 2, neighborHexNodeIndex: 14 },
        { connectionDirection: 3, neighborHexNodeIndex: 13 },
        { connectionDirection: 4, neighborHexNodeIndex: 8 },
        { connectionDirection: 5, neighborHexNodeIndex: 4 },
    ],
    10: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 6 },
        { connectionDirection: 1, neighborHexNodeIndex: 11 }, 
        { connectionDirection: 2, neighborHexNodeIndex: 15 },
        { connectionDirection: 3, neighborHexNodeIndex: 14 },
        { connectionDirection: 4, neighborHexNodeIndex: 9 },
        { connectionDirection: 5, neighborHexNodeIndex: 5 },
    ],
    11: 
    [
        { connectionDirection: 3, neighborHexNodeIndex: 15 },
        { connectionDirection: 4, neighborHexNodeIndex: 10 },
        { connectionDirection: 5, neighborHexNodeIndex: 6 },
    ],
    12: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 8 },
        { connectionDirection: 1, neighborHexNodeIndex: 13 }, 
        { connectionDirection: 2, neighborHexNodeIndex: 16 },
        { connectionDirection: 5, neighborHexNodeIndex: 7 },
    ],
    13: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 9 },
        { connectionDirection: 1, neighborHexNodeIndex: 14 }, 
        { connectionDirection: 2, neighborHexNodeIndex: 17 },
        { connectionDirection: 3, neighborHexNodeIndex: 16 },
        { connectionDirection: 4, neighborHexNodeIndex: 12 },
        { connectionDirection: 5, neighborHexNodeIndex: 8 },
    ],
    14: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 10 },
        { connectionDirection: 1, neighborHexNodeIndex: 15 }, 
        { connectionDirection: 2, neighborHexNodeIndex: 18 },
        { connectionDirection: 3, neighborHexNodeIndex: 17 },
        { connectionDirection: 4, neighborHexNodeIndex: 13 },
        { connectionDirection: 5, neighborHexNodeIndex: 9 },
    ],
    15: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 11 },
        { connectionDirection: 3, neighborHexNodeIndex: 18 },
        { connectionDirection: 4, neighborHexNodeIndex: 14 },
        { connectionDirection: 5, neighborHexNodeIndex: 10 },
    ],
    16: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 13 },
        { connectionDirection: 1, neighborHexNodeIndex: 17 }, 
        { connectionDirection: 5, neighborHexNodeIndex: 12 },
    ],
    17: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 14 },
        { connectionDirection: 1, neighborHexNodeIndex: 18 }, 
        { connectionDirection: 4, neighborHexNodeIndex: 16 },
        { connectionDirection: 5, neighborHexNodeIndex: 13 },
    ],
    18: 
    [
        { connectionDirection: 0, neighborHexNodeIndex: 15 },
        { connectionDirection: 4, neighborHexNodeIndex: 17 },
        { connectionDirection: 5, neighborHexNodeIndex: 14 },
    ],
};

// CW order
const edgesMap: { [edgeIndex: EdgeIndex_t]: HexNodeIndex_t[] } = {
    0: [0, 1, 2],
    1: [2, 6, 11],
    2: [11, 15, 18],
    3: [18, 17, 16],
    4: [16, 12, 7],
    5: [7, 3, 0],
}

// CCW order
// const edgesMap: { [edgeIndex: EdgeIndex_t]: HexNodeIndex_t[] } = {
//     0: [0, 1, 2],
//     5: [7, 3, 0],
//     4: [16, 12, 7],
//     3: [18, 17, 16],
//     2: [11, 15, 18],
//     1: [2, 6, 11],
// }

export const rotationLookup: { [hexNodeIndex: HexNodeIndex_t]: HexNodeIndex_t[] } = {
    
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
    
    
    // Counter-clockwise table
    // 0:[0, 7, 16, 18, 11, 2],
    // 1:[1, 3, 12, 17, 15, 6],
    // 2:[2, 0, 7, 16, 18, 11],
    // 3:[3, 12, 17, 15, 6, 1],
    // 4:[4, 8, 13, 14, 10, 5],
    // 5:[5, 4, 8, 13, 14, 10],
    // 6:[6, 1, 3, 12, 17, 15],
    // 7:[7, 16, 18, 11, 2, 0],
    // 8:[8, 13, 14, 10, 5, 4],
    // 9:[9, 9, 9, 9, 9, 9],
    // 10:[10, 5, 4, 8, 13, 14],
    // 11:[11, 2, 0, 7, 16, 18],
    // 12:[12, 17, 15, 6, 1, 3],
    // 13:[13, 14, 10, 5, 4, 8],
    // 14:[14, 10, 5, 4, 8, 13],
    // 15:[15, 6, 1, 3, 12, 17],
    // 16:[16, 18, 11, 2, 0, 7],
    // 17:[17, 15, 6, 1, 3, 12],
    // 18:[18, 11, 2, 0, 7, 16]
    
}

export interface NodeMap_t { [ hexNodeIndex: HexNodeIndex_t ]: HexNode_t };

export interface BoardPiece_t 
{
    boardPieceIndex: BoardPieceIndex_t,
    nodes: { [ hexNodeIndex: HexNodeIndex_t ] : HexNode_t },
    rotation: number,
    templateIndex: number,
}

export function CreateBoardPiece( boardPieceIndex: BoardPieceIndex_t, templateIndex: number, templateNodes: NodeDescription[] )
{
    let nodes: HexNode_t[] = templateNodes.map( ( templateNode, hexNodeIndex ) => {
        return {
            hexNodeIndex,
            nodeType: templateNode.type,
            isPlanet: templateNode.name ? true : false , 
            planetName: templateNode.name,
            neighbors: []
        }
    });
    const nodesWithNeighbors = SetNodeNeighbors( nodes, boardPieceIndex );

    return {
        boardPieceIndex, 
        templateIndex,
        rotation: debugLinearRotations ? boardPieceIndex % 6 : Math.floor(Math.random() * 5),
        nodes: nodesWithNeighbors
    }

}

function SetNodeNeighbors( nodes: HexNode_t[], boardPieceIndex: BoardPieceIndex_t )
{
    let newNodes: NodeMap_t = {};
    const orbitNodes = nodes.filter( ( nodes ) => nodes.nodeType === NodeType.orbit );
    nodes.forEach((node, index) =>
    {
        const neighborData = neighborsMap[index];
        const nodeNeighbors: HexNodeNeighbor_t[] = [];

        neighborData.forEach( ( neighborData ) => 
        {
            const neighborNode = nodes[neighborData.neighborHexNodeIndex];
            nodeNeighbors.push({ location: { boardPieceIndex: boardPieceIndex, hexNodeIndex: neighborNode.hexNodeIndex }, connectionDirection: neighborData.connectionDirection } )
        });

        if( node.nodeType === NodeType.orbit )
        {
            orbitNodes.forEach( ( orbitNode ) => 
            {
                if( nodeNeighbors.findIndex( ( neighbor ) => neighbor.location.hexNodeIndex === orbitNode.hexNodeIndex ) > -1 )
                    return;
                else if ( orbitNode.hexNodeIndex === node.hexNodeIndex ) 
                    return;
                else 
                nodeNeighbors.push( { location: { boardPieceIndex: boardPieceIndex, hexNodeIndex: orbitNode.hexNodeIndex }, connectionDirection: undefined } );
            })
        }

        newNodes[ node.hexNodeIndex ] = {
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

export function GetBoardPieceEdgeInfo( boardPiece: BoardPiece_t, requestedEdgeIndex: EdgeIndex_t ): { nodeIndices: HexNodeIndex_t[], edgeIndex: EdgeIndex_t }
{
    const actualEdgeIndex = (requestedEdgeIndex + boardPiece.rotation) % 6;
    return { nodeIndices: edgesMap[actualEdgeIndex], edgeIndex: actualEdgeIndex };
}

export function GetRotatedNodeAtIndex( sourceHexNodeIndex: HexNodeIndex_t, boardPiece: BoardPiece_t )
{
    const lookupIndices = rotationLookup[sourceHexNodeIndex];
    const hexNodeIndex = lookupIndices[boardPiece.rotation];
    const rotatedNode = boardPiece.nodes[hexNodeIndex];
    return rotatedNode;
}