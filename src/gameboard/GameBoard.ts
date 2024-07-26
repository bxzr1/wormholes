import {  BoardPiece_t, CreateBoardPiece, GetBoardPieceEdgeIndices, GetRotatedBoardPiece } from "./BoardPiece";
import { HexLocation_t, HexNode_t } from "./HexNode";
import { isUnreachable, NodeType, template } from "../template";

interface BoardPieceConnection {
    neighborPieceIndex: number;
    neighborEdgeIndex: number;
    thisEdgeIndex: number;
}

export interface BoardPieceMap_t { [ boardPieceID: number ]: BoardPiece_t };

const boardPieceNeighborsMap: { [key: number]: BoardPieceConnection[] } = {
    // Connection object for each of these
    0: [
        { neighborPieceIndex: 1, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 4, thisEdgeIndex: 1 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 5, thisEdgeIndex: 2 }
    ], 
    1: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 0, thisEdgeIndex: 3 },
        { neighborPieceIndex: 2, neighborEdgeIndex: 4, thisEdgeIndex: 1 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 5, thisEdgeIndex: 2 }
    ],
    2: [
        { neighborPieceIndex: 1, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 0, thisEdgeIndex: 3 }
    ],
    3: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 1, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 2, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 0, thisEdgeIndex: 3 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 5, thisEdgeIndex: 2 }
    ],
    4: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 5, neighborEdgeIndex: 0, thisEdgeIndex: 4 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 5, thisEdgeIndex: 2 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 4, thisEdgeIndex: 1 },
    ],
    5: [
        { neighborPieceIndex: 4, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 4, thisEdgeIndex: 1 }
    ],
    6: [
        { neighborPieceIndex: 4, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 5, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 3, thisEdgeIndex: 0 }
    ],
    7: [
        { neighborPieceIndex: 3, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 0, thisEdgeIndex: 3 }
    ]
};

const edgeLookupIndices: { [key: number]: number[] } = {
    0: [2, 1],
    1: [1, 0],
    2: [0],
};

export function GenerateGameBoard( numberOfPieces: number )
{
    let templateIndex = 0;
    let templateIndices = randomizeArray();
    let pieces: BoardPieceMap_t = {};
    
    while ( Object.keys( pieces ).length < numberOfPieces) {  
        const placementIndex = Object.keys( pieces ).length;
        const boardPiece = CreateBoardPiece( placementIndex, templateIndex, template[templateIndices[templateIndex]]);
       try{
            pieces = addBoardPiece( pieces, boardPiece, placementIndex );
            templateIndex += 1;
       }
       catch ( e )
       {
            templateIndices = randomizeArray();
            templateIndex = 0;
            pieces = {};
       }
    }

    return pieces;
    // sessionStorage.setItem("gameBoard", this.toJson());
}

function randomizeArray()
{
    const templateIndices = Array.from(Array(template.length).keys());

    for (let i = template.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1)) + 1;
        const temp = templateIndices[i];
        templateIndices[i] = templateIndices[randomIndex];
        templateIndices[randomIndex] = temp;
    }
    return templateIndices;

}

function addBoardPiece( pieces: BoardPieceMap_t, boardPiece: BoardPiece_t, boardPieceIndex: number ): BoardPieceMap_t
{
    let numRotations = 0;
    let rotatedBoardPiece = {...boardPiece };
    let isValid = validateBoardPiece( pieces, rotatedBoardPiece, boardPieceIndex);
    while (!isValid && numRotations < 6) {
        rotatedBoardPiece = GetRotatedBoardPiece( rotatedBoardPiece ); 
        numRotations += 1;
        isValid = validateBoardPiece(pieces, rotatedBoardPiece, boardPieceIndex);
    }
    if (numRotations >= 6) {
        throw Error('invalid rotations')
    }

    const linkedBoardPiece = linkBoardPieces( pieces, boardPiece, boardPieceIndex);
    return linkedBoardPiece;
}

function validateBoardPiece( pieces: BoardPieceMap_t, boardPiece: BoardPiece_t, boardPieceIndex: number ): boolean
{
    const boardPieceConnections = boardPieceNeighborsMap[boardPieceIndex];
    for (const boardPieceConnection of boardPieceConnections) {
        const neighborPiece = pieces[boardPieceConnection.neighborPieceIndex];
        if (!neighborPiece) {
            continue;
        }
        const neighborEdgeIndices = GetBoardPieceEdgeIndices( neighborPiece, boardPieceConnection.neighborEdgeIndex)
        const thisEdgeIndices = GetBoardPieceEdgeIndices( boardPiece, boardPieceConnection.thisEdgeIndex)
        const neighborEdge = neighborEdgeIndices.map( ( edgeIndex ) => neighborPiece.nodes[edgeIndex ]);
        const thisEdge = thisEdgeIndices.map( ( edgeIndex ) => boardPiece.nodes[edgeIndex ]);

        if ( !validateEdge(pieces, thisEdge, neighborEdge)) {
            return false;
        }
        
        if ( !validateEdge(pieces, neighborEdge, thisEdge)) {
            return false;
        }
    }

    return true;
}

function validateEdge( pieces: BoardPieceMap_t, edge: HexNode_t[], neighborEdge: HexNode_t[] ): boolean
{
    const edgePlanetIndices = edge.map((edgeNode, index) => {
        if (edgeNode.nodeType === NodeType.planet) {
            return index;
        }

        return undefined;
    });

    for (const edgePlanetIndex of edgePlanetIndices) {
        if (edgePlanetIndex === undefined) {
            continue;
        }
        
        if (validateIfNearPlanet( pieces, edgeLookupIndices[edgePlanetIndex].map(index => neighborEdge[index]))) {
            return false;
        }
    }

    return true;
}

function linkBoardPieces( pieces: BoardPieceMap_t, boardPiece: BoardPiece_t, boardPieceIndex: number ): BoardPieceMap_t
{
    const boardPieceConnections = boardPieceNeighborsMap[boardPieceIndex];
    let linkedPieces = {...pieces, [ boardPieceIndex ]: boardPiece };
    for (const boardPieceConnection of boardPieceConnections) {
        const neighborPiece = linkedPieces[boardPieceConnection.neighborPieceIndex];
        if (!neighborPiece) 
        {
            continue;
        }
        const neighborEdgeIndices = GetBoardPieceEdgeIndices( neighborPiece, boardPieceConnection.neighborEdgeIndex)
        const thisEdgeIndices = GetBoardPieceEdgeIndices( boardPiece, boardPieceConnection.thisEdgeIndex)
        
        linkedPieces = linkHexNodes( linkedPieces, { boardPieceID: boardPieceIndex, hexNodeID: thisEdgeIndices[0] }, { boardPieceID: boardPieceConnection.neighborPieceIndex, hexNodeID: neighborEdgeIndices[2] } );
        linkedPieces = linkHexNodes( linkedPieces, { boardPieceID: boardPieceIndex, hexNodeID: thisEdgeIndices[0] }, { boardPieceID: boardPieceConnection.neighborPieceIndex, hexNodeID: neighborEdgeIndices[1] } );

        linkedPieces = linkHexNodes( linkedPieces, { boardPieceID: boardPieceIndex, hexNodeID: thisEdgeIndices[1] }, { boardPieceID: boardPieceConnection.neighborPieceIndex, hexNodeID: neighborEdgeIndices[1] } );
        linkedPieces = linkHexNodes( linkedPieces, { boardPieceID: boardPieceIndex, hexNodeID: thisEdgeIndices[1] }, { boardPieceID: boardPieceConnection.neighborPieceIndex, hexNodeID: neighborEdgeIndices[0] } );

        linkedPieces = linkHexNodes( linkedPieces, { boardPieceID: boardPieceIndex, hexNodeID: thisEdgeIndices[2] }, { boardPieceID: boardPieceConnection.neighborPieceIndex, hexNodeID: neighborEdgeIndices[0] } );
    }

    return linkedPieces;
}

function linkHexNodes( pieces: BoardPieceMap_t, sourceLocation: HexLocation_t, neighborLocation: HexLocation_t ): BoardPieceMap_t
{
    let tempPieces = { ...pieces };
    let sourceNode = tempPieces[sourceLocation.boardPieceID].nodes[sourceLocation.hexNodeID];
    let neighborNode = tempPieces[neighborLocation.boardPieceID].nodes[neighborLocation.hexNodeID];
    if( isUnreachable( neighborNode.nodeType) || isUnreachable(sourceNode.nodeType) )
        return tempPieces;

    if( sourceNode.neighborLocations.findIndex( ( neighbor ) => neighbor.boardPieceID === neighborLocation.boardPieceID && neighbor.hexNodeID === neighborLocation.hexNodeID ) < 0 )
    {
        sourceNode.neighborLocations.push(neighborLocation);
    }
    if( neighborNode.neighborLocations.findIndex( ( neighbor ) => neighbor.boardPieceID === sourceLocation.boardPieceID && neighbor.hexNodeID === sourceLocation.hexNodeID ) < 0 )
    {
        neighborNode.neighborLocations.push( sourceLocation )
    }
    
    return tempPieces;

}

function validateIfNearPlanet( pieces: BoardPieceMap_t, edges: HexNode_t[] ): boolean
{
    for (const edge of edges) {
        if (edge.nodeType === NodeType.planet) {
            return false;
        }

        const neighborNodes = edge.neighborLocations.map( ( neighbor ) => {
            const boardPiece = pieces[neighbor.boardPieceID];
            const node = boardPiece.nodes[neighbor.hexNodeID ];
            return node;
        })

        if (neighborNodes.find(neighbor => neighbor.nodeType === NodeType.planet)) {
            return false;
        }
    }

    return true;
}