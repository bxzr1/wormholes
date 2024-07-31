import {  BoardPiece_t, BoardPieceIndex_t, CreateBoardPiece, EdgeIndex_t, EdgeNodeIndex_t, GetBoardPieceEdgeInfo, GetRotatedBoardPiece } from "./boardpieceutils";
import { ConnectionDirection_t, debugMode, HexLocation_t, HexNode_t, HexNodeNeighbor_t } from "./hexnodeutils";
import { NodeType, template } from "../template";

interface BoardPieceConnection {
    neighborPieceIndex: BoardPieceIndex_t;
    neighborEdgeIndex: EdgeIndex_t;
    sourceEdgeIndex: EdgeIndex_t;
}

export interface BoardPieceMap_t { [ boardPieceIndex: BoardPieceIndex_t ]: BoardPiece_t };

// see game_board_diagram under image-references/indexandnamingdiagram for more details
const boardPieceNeighborsMap: { [ boardPieceIndex: BoardPieceIndex_t ]: BoardPieceConnection[] } = {
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

// see board_piece_connection_diagram under image-references/indexandnamingdiagram for details
const lookupConnectedEdgeNodeIndicies: { [ sourceEdgeNodeIndex: EdgeNodeIndex_t ]: { linkedEdgeNodeIndex: EdgeNodeIndex_t, connectionDirectionAdjustment: number }[] } = {
    0: [
        { linkedEdgeNodeIndex: 2,  connectionDirectionAdjustment: -1 },
        { linkedEdgeNodeIndex: 1,  connectionDirectionAdjustment: 0 },
    ],
    1:  [
        { linkedEdgeNodeIndex: 1,  connectionDirectionAdjustment: -1 },
        { linkedEdgeNodeIndex: 0,  connectionDirectionAdjustment: 0 },
    ],
    2:  [
        { linkedEdgeNodeIndex: 0,  connectionDirectionAdjustment: -1 },
    ],
};

export function GenerateGameBoard( numberOfPieces: number )
{
    let iterateRandomTemplateIndicies = 0;
    let randomizedTemplateIndicies = randomizeArray();
    let pieces: BoardPieceMap_t = {};
    let spaceCannonLocation: HexLocation_t | null = null;
    
    while ( Object.keys( pieces ).length < numberOfPieces) {
        const boardPieceIndex = Object.keys( pieces ).length;
        const templateIndex = randomizedTemplateIndicies[iterateRandomTemplateIndicies];
        const templateNodes = template[templateIndex];
        const spaceGunIndex = templateNodes.findIndex( ( node ) => node.type === NodeType.cannon );

        if( spaceGunIndex > -1 )
        {
            spaceCannonLocation = { boardPieceIndex, hexNodeIndex: spaceGunIndex };
        }
        const boardPiece = CreateBoardPiece( boardPieceIndex, templateIndex, templateNodes);
       try{
            pieces = addBoardPiece( pieces, boardPiece, boardPieceIndex );
            iterateRandomTemplateIndicies += 1;
       }
       catch ( e )
       {
            randomizedTemplateIndicies = randomizeArray();
            iterateRandomTemplateIndicies = 0;
            pieces = {};
       }
    }

    if( spaceCannonLocation !== null)
       return linkSpaceCannon( pieces, spaceCannonLocation )

    return pieces;
}

function randomizeArray()
{
    const templateIndices = Array.from(Array(template.length).keys());

    if( !debugMode )
    {
        for (let i = template.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1)) + 1;
            const temp = templateIndices[i];
            templateIndices[i] = templateIndices[randomIndex];
            templateIndices[randomIndex] = temp;
        }
    }
    return templateIndices;

}

function addBoardPiece( pieces: BoardPieceMap_t, boardPiece: BoardPiece_t, boardPieceIndex: BoardPieceIndex_t ): BoardPieceMap_t
{
    let numRotations = 0;
    let rotatedBoardPiece = {...boardPiece };
    let canLink = canLinkBoardPiece( pieces, rotatedBoardPiece, boardPieceIndex);
    while (!canLink && numRotations < 6) {
        rotatedBoardPiece = GetRotatedBoardPiece( rotatedBoardPiece ); 
        numRotations += 1;
        canLink = canLinkBoardPiece(pieces, rotatedBoardPiece, boardPieceIndex);
    }
    if (numRotations >= 6) {
        throw Error('invalid rotations')
    }

    const linkedBoardPiece = linkBoardPieces( pieces, boardPiece, boardPieceIndex);
    return linkedBoardPiece;
}

function canLinkBoardPiece( pieces: BoardPieceMap_t, boardPiece: BoardPiece_t, boardPieceIndex: BoardPieceIndex_t ): boolean
{
    const boardPieceConnections = boardPieceNeighborsMap[boardPieceIndex];
    for (const boardPieceConnection of boardPieceConnections) {
        const neighborPiece = pieces[boardPieceConnection.neighborPieceIndex];
        if (!neighborPiece) {
            continue;
        }
        const neighborEdgeInfo = GetBoardPieceEdgeInfo( neighborPiece, boardPieceConnection.neighborEdgeIndex)
        const sourceEdgeInfo = GetBoardPieceEdgeInfo( boardPiece, boardPieceConnection.sourceEdgeIndex)
        const neighborEdgeNodes = neighborEdgeInfo.nodeIndices.map( ( edgeIndex ) => neighborPiece.nodes[edgeIndex ]);
        const soureEdgeNodes = sourceEdgeInfo.nodeIndices.map( ( edgeIndex ) => boardPiece.nodes[edgeIndex ]);

        if ( !canConnectEdge(pieces, soureEdgeNodes, neighborEdgeNodes)) {
            return false;
        }
        
        if ( !canConnectEdge(pieces, neighborEdgeNodes, soureEdgeNodes)) {
            return false;
        }
    }

    return true;
}

function canConnectEdge( pieces: BoardPieceMap_t, sourceEdgeNodes: HexNode_t[], neighborEdgeNodes: HexNode_t[] ): boolean
{
    const edgeNodesIndiciesOfPlanets = sourceEdgeNodes.map( ( edgeNode, edgeNodeIndex ) => {
        if (edgeNode.nodeType === NodeType.planet) {
            return edgeNodeIndex;
        }

        return undefined;
    });

    for (const edgeNodeIndexOfPlanet of edgeNodesIndiciesOfPlanets) {
        if (edgeNodeIndexOfPlanet === undefined) {
            continue;
        }
        const linkedNeighborEdgeNodeIndices = lookupConnectedEdgeNodeIndicies[edgeNodeIndexOfPlanet];
        const linkedNeighborEdgeNodes = linkedNeighborEdgeNodeIndices.map(linkedEdge => neighborEdgeNodes[ linkedEdge.linkedEdgeNodeIndex ])
        if ( validateNodesNotPlanetOrNeighborToPlanet( pieces, linkedNeighborEdgeNodes )) {
            return false;
        }
    }

    return true;
}

function linkBoardPieces( pieces: BoardPieceMap_t, boardPiece: BoardPiece_t, boardPieceIndex: BoardPieceIndex_t ): BoardPieceMap_t
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
        
        for( let sourceEdgeNodeIndex = 0; sourceEdgeNodeIndex < sourceEdgeInfo.nodeIndices.length; sourceEdgeNodeIndex++ )
        {
            const sourceNodeIndex = sourceEdgeInfo.nodeIndices[sourceEdgeNodeIndex];
            const neighborNodesToLink = lookupConnectedEdgeNodeIndicies[ sourceEdgeNodeIndex ];
            for( let neighborEdgeNodeIndex = 0; neighborEdgeNodeIndex < neighborNodesToLink.length; neighborEdgeNodeIndex++ )
            {
                const neighborNodeIndex = neighborNodesToLink[neighborEdgeNodeIndex];
                linkedPieces = linkEdgeNodes( linkedPieces, 
                    { boardPieceIndex: boardPieceIndex, hexNodeIndex: sourceNodeIndex },
                    ( sourceEdgeInfo.edgeIndex - 1 + neighborEdgeNodeIndex + 6 ) % 6, // connection direction on the source node to the neighbor node
                    { boardPieceIndex: boardPieceConnection.neighborPieceIndex, hexNodeIndex: neighborEdgeInfo.nodeIndices[ neighborNodeIndex.linkedEdgeNodeIndex ] },
                    ( neighborEdgeInfo.edgeIndex + neighborNodeIndex.connectionDirectionAdjustment + 6 ) % 6, // connection direction on the neighbor node back to the source node 
                );
            }
        }
    }

    return linkedPieces;
}

function linkEdgeNodes( pieces: BoardPieceMap_t, sourceLocation: HexLocation_t, sourceDirection: ConnectionDirection_t, neighborLocation: HexLocation_t, neighborDirection: ConnectionDirection_t ): BoardPieceMap_t
{
    let tempPieces = { ...pieces };
    let sourceNode = tempPieces[sourceLocation.boardPieceIndex].nodes[sourceLocation.hexNodeIndex];
    let neighborNode = tempPieces[neighborLocation.boardPieceIndex].nodes[neighborLocation.hexNodeIndex];

    if( sourceNode.neighbors.findIndex( ( neighbor ) => neighbor.location.boardPieceIndex === neighborLocation.boardPieceIndex && neighbor.location.hexNodeIndex === neighborLocation.hexNodeIndex ) < 0 )
    {
        sourceNode.neighbors.push({ location: neighborLocation, connectionDirection: sourceDirection });
    }
    if( neighborNode.neighbors.findIndex( ( neighbor ) => neighbor.location.boardPieceIndex === sourceLocation.boardPieceIndex && neighbor.location.hexNodeIndex === sourceLocation.hexNodeIndex ) < 0 )
    {
        neighborNode.neighbors.push( { location: sourceLocation, connectionDirection: neighborDirection } )
    }
    
    return tempPieces;

}

function validateNodesNotPlanetOrNeighborToPlanet( pieces: BoardPieceMap_t, edgeNodes: HexNode_t[] ): boolean
{
    for (const edge of edgeNodes) {
        if (edge.nodeType === NodeType.planet) {
            return false;
        }

        const neighborNodes = edge.neighbors.map( ( neighbor ) => {
            const boardPiece = pieces[neighbor.location.boardPieceIndex];
            const node = boardPiece.nodes[neighbor.location.hexNodeIndex ];
            return node;
        })

        if (neighborNodes.find(neighbor => neighbor.nodeType === NodeType.planet)) {
            return false;
        }
    }

    return true;
}

// black magic rotation math, don't ask me how i did it
function linkSpaceCannon( pieces:BoardPieceMap_t, spaceCannonLocation: HexLocation_t )
{
    const tempPieces = { ...pieces };
    const { boardPieceIndex: spaceCannonBoardPieceIndex, hexNodeIndex: spaceCannonHexNodeIndex } = spaceCannonLocation;
    const spaceCannonBoardPiece= tempPieces[spaceCannonBoardPieceIndex]
    const spaceCannonNode = spaceCannonBoardPiece.nodes[spaceCannonHexNodeIndex];

    const neighborsToCheck : HexNodeNeighbor_t[]= [];
    spaceCannonNode.neighbors.forEach( (cannonNeighbor) => { 
        if( cannonNeighbor.connectionDirection === undefined)
            return;

        const bAddRotationToDirection = cannonNeighbor.location.boardPieceIndex !== spaceCannonBoardPieceIndex;
        const neighborRotation = bAddRotationToDirection ? pieces[cannonNeighbor.location.boardPieceIndex].rotation - spaceCannonBoardPiece.rotation : 0;
        neighborsToCheck.push( { location: cannonNeighbor.location, connectionDirection: cannonNeighbor.connectionDirection + neighborRotation } );
    });

    const spaceCannonNeighbors: HexNodeNeighbor_t[] = [];
    let checkIndex = 0;
    while( neighborsToCheck.length > checkIndex )
    {
        const targetNeighbor = neighborsToCheck[ checkIndex ];
        const { boardPieceIndex: targetPieceIndex, hexNodeIndex: targetNodeIndex } = targetNeighbor.location;
        const targetBoardPiece = tempPieces[targetPieceIndex];
        const neighborNode = targetBoardPiece.nodes[targetNodeIndex];

        neighborNode.neighbors.forEach( ( neighbor ) => 
        {
            const queuedToCheck = neighborsToCheck.findIndex( ( neighborToCheck ) => 
                neighborToCheck.location.boardPieceIndex === neighbor.location.boardPieceIndex && 
                neighborToCheck.location.hexNodeIndex === neighbor.location.hexNodeIndex
            )
            if( queuedToCheck < 0 && !( targetNeighbor.connectionDirection === undefined ) && neighbor.connectionDirection === targetNeighbor.connectionDirection )
            {
                const bAddRotationToDirection = neighbor.location.boardPieceIndex !== targetPieceIndex
                const neighborRotation = bAddRotationToDirection ? pieces[neighbor.location.boardPieceIndex].rotation - targetBoardPiece.rotation : 0;
                neighborsToCheck.push({ location: neighbor.location, connectionDirection: ( targetNeighbor.connectionDirection + neighborRotation + 6 ) % 6 })
            }
        });

        spaceCannonNeighbors.push( targetNeighbor )
        checkIndex++
    }

    return {
        ...tempPieces,
        [ spaceCannonBoardPieceIndex ]: {
            ...tempPieces[ spaceCannonBoardPieceIndex ],
            nodes: {
                ...tempPieces[ spaceCannonBoardPieceIndex ].nodes,
                [ spaceCannonHexNodeIndex ]: {
                    ...spaceCannonNode,
                    neighbors: spaceCannonNeighbors
                }
            }
        }
    }
}