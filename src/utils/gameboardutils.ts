import {  BoardPiece_t, CreateBoardPiece, GetBoardPieceEdgeInfo, GetRotatedBoardPiece } from "./boardpieceutils";
import { HexLocation_t, HexNode_t } from "./hexnodeutils";
import { isUnreachable, NodeType, template } from "../template";

interface BoardPieceConnection {
    neighborPieceIndex: number;
    neighborEdgeIndex: number;
    sourceEdgeIndex: number;
}

export interface BoardPieceMap_t { [ boardPieceID: number ]: BoardPiece_t };

const boardPieceNeighborsMap: { [key: number]: BoardPieceConnection[] } = {
    // Connection object for each of these
    0: [
        { neighborPieceIndex: 1, neighborEdgeIndex: 3, sourceEdgeIndex: 0 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 4, sourceEdgeIndex: 1 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 5, sourceEdgeIndex: 2 }
    ], 
    1: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 0, sourceEdgeIndex: 3 },
        { neighborPieceIndex: 2, neighborEdgeIndex: 4, sourceEdgeIndex: 1 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 5, sourceEdgeIndex: 2 }
    ],
    2: [
        { neighborPieceIndex: 1, neighborEdgeIndex: 1, sourceEdgeIndex: 4 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 0, sourceEdgeIndex: 3 }
    ],
    3: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 1, sourceEdgeIndex: 4 },
        { neighborPieceIndex: 1, neighborEdgeIndex: 2, sourceEdgeIndex: 5 },
        { neighborPieceIndex: 2, neighborEdgeIndex: 3, sourceEdgeIndex: 0 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 0, sourceEdgeIndex: 3 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 5, sourceEdgeIndex: 2 }
    ],
    4: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 2, sourceEdgeIndex: 5 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 3, sourceEdgeIndex: 0 },
        { neighborPieceIndex: 5, neighborEdgeIndex: 0, sourceEdgeIndex: 4 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 5, sourceEdgeIndex: 2 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 4, sourceEdgeIndex: 1 },
    ],
    5: [
        { neighborPieceIndex: 4, neighborEdgeIndex: 3, sourceEdgeIndex: 0 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 4, sourceEdgeIndex: 1 }
    ],
    6: [
        { neighborPieceIndex: 4, neighborEdgeIndex: 2, sourceEdgeIndex: 5 },
        { neighborPieceIndex: 5, neighborEdgeIndex: 1, sourceEdgeIndex: 4 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 3, sourceEdgeIndex: 0 }
    ],
    7: [
        { neighborPieceIndex: 3, neighborEdgeIndex: 2, sourceEdgeIndex: 5 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 1, sourceEdgeIndex: 4 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 0, sourceEdgeIndex: 3 }
    ]
};

// see edge_index_matchup under image-references for details
const lookupEdgeIndicies: { [ sourceEdgeIndex: number]: { linkedEdgeIndex: number, orientationAdjustment: number }[] } = {
    0: [
        { linkedEdgeIndex: 2,  orientationAdjustment: -1 },
        { linkedEdgeIndex: 1,  orientationAdjustment: 0 },
    ],
    1:  [
        { linkedEdgeIndex: 1,  orientationAdjustment: -1 },
        { linkedEdgeIndex: 0,  orientationAdjustment: 0 },
    ],
    2:  [
        { linkedEdgeIndex: 0,  orientationAdjustment: -1 },
    ],
};

export function GenerateGameBoard( numberOfPieces: number )
{
    let iterateRandomTemplateIndicies = 0;
    let randomizedTemplateIndicies = randomizeArray();
    let pieces: BoardPieceMap_t = {};
    
    while ( Object.keys( pieces ).length < numberOfPieces) {  
        const placementBoardIndex = Object.keys( pieces ).length;
        const templateIndex = randomizedTemplateIndicies[iterateRandomTemplateIndicies];
        const boardPiece = CreateBoardPiece( placementBoardIndex, templateIndex, template[templateIndex]);
       try{
            pieces = addBoardPiece( pieces, boardPiece, placementBoardIndex );
            iterateRandomTemplateIndicies += 1;
       }
       catch ( e )
       {
            randomizedTemplateIndicies = randomizeArray();
            iterateRandomTemplateIndicies = 0;
            pieces = {};
       }
    }

    return pieces;
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
        const neighborEdgeIndices = GetBoardPieceEdgeInfo( neighborPiece, boardPieceConnection.neighborEdgeIndex)
        const thisEdgeIndices = GetBoardPieceEdgeInfo( boardPiece, boardPieceConnection.sourceEdgeIndex)
        const neighborEdge = neighborEdgeIndices.nodeIndices.map( ( edgeIndex ) => neighborPiece.nodes[edgeIndex ]);
        const thisEdge = thisEdgeIndices.nodeIndices.map( ( edgeIndex ) => boardPiece.nodes[edgeIndex ]);

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
        
        if (validateIfNearPlanet( pieces, lookupEdgeIndicies[edgePlanetIndex].map(linkedEdge => neighborEdge[ linkedEdge.linkedEdgeIndex ]))) {
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
        const neighborEdgeInfo = GetBoardPieceEdgeInfo( neighborPiece, boardPieceConnection.neighborEdgeIndex)
        const sourceEdgeInfo = GetBoardPieceEdgeInfo( boardPiece, boardPieceConnection.sourceEdgeIndex)
        
        sourceEdgeInfo.nodeIndices.forEach( ( sourceNodeIndex, index ) => {
            const neighborNodesToLink = lookupEdgeIndicies[ index ];
            neighborNodesToLink.forEach( ( neighborNodeIndex, linkIndex ) => {
                linkedPieces = linkEdgeNodes( linkedPieces, 
                    { boardPieceID: boardPieceIndex, hexNodeID: sourceNodeIndex },
                    ( sourceEdgeInfo.edgeIndex - 1 + linkIndex + 6 ) % 6, // orientation direction for the source node to the neighbor node
                    { boardPieceID: boardPieceConnection.neighborPieceIndex, hexNodeID: neighborEdgeInfo.nodeIndices[ neighborNodeIndex.linkedEdgeIndex ] },
                    ( neighborEdgeInfo.edgeIndex + neighborNodeIndex.orientationAdjustment + 6 ) % 6, // orientation direction for the neighbor node back to the source node 
                );
            })
        })
    }

    return linkedPieces;
}

function linkEdgeNodes( pieces: BoardPieceMap_t, sourceLocation: HexLocation_t, sourceOrientation: number, neighborLocation: HexLocation_t, neighborOrientation: number ): BoardPieceMap_t
{
    let tempPieces = { ...pieces };
    let sourceNode = tempPieces[sourceLocation.boardPieceID].nodes[sourceLocation.hexNodeID];
    let neighborNode = tempPieces[neighborLocation.boardPieceID].nodes[neighborLocation.hexNodeID];
    if( isUnreachable( neighborNode.nodeType) || isUnreachable(sourceNode.nodeType) )
        return tempPieces;

    if( sourceNode.neighbors.findIndex( ( neighbor ) => neighbor.location.boardPieceID === neighborLocation.boardPieceID && neighbor.location.hexNodeID === neighborLocation.hexNodeID ) < 0 )
    {
        sourceNode.neighbors.push({ location: neighborLocation, orientation: sourceOrientation });
    }
    if( neighborNode.neighbors.findIndex( ( neighbor ) => neighbor.location.boardPieceID === sourceLocation.boardPieceID && neighbor.location.hexNodeID === sourceLocation.hexNodeID ) < 0 )
    {
        neighborNode.neighbors.push( { location: sourceLocation, orientation: neighborOrientation } )
    }
    
    return tempPieces;

}

function validateIfNearPlanet( pieces: BoardPieceMap_t, edges: HexNode_t[] ): boolean
{
    for (const edge of edges) {
        if (edge.nodeType === NodeType.planet) {
            return false;
        }

        const neighborNodes = edge.neighbors.map( ( neighbor ) => {
            const boardPiece = pieces[neighbor.location.boardPieceID];
            const node = boardPiece.nodes[neighbor.location.hexNodeID ];
            return node;
        })

        if (neighborNodes.find(neighbor => neighbor.nodeType === NodeType.planet)) {
            return false;
        }
    }

    return true;
}