import { BoardPiece_t, CreateBoardPiece, GetBoardPieceEdgeInfo, GetRotatedBoardPiece } from "./boardpieceutils";
import { HexLocation_t, HexNode_t, HexNodeNeighbor_t } from "./hexnodeutils";
import { NodeDescription, NodeType, PlanetTypes, template } from "../template";
import { debugLinearTemplatePieces } from "./debugutils";
import { BoardPieceIndex_t, ConnectionDirection_t, ValidateConnectionDirection, EdgeIndex_t, EdgeNodeIndex_t, HexNodeIndex_t } from "./aliasutils";

interface BoardPieceConnection {
    neighborPieceIndex: BoardPieceIndex_t;
    neighborEdgeIndex: EdgeIndex_t;
    sourceEdgeIndex: EdgeIndex_t;
}

export interface BoardPieceMap_t { [ boardPieceIndex: BoardPieceIndex_t ]: BoardPiece_t };

// see game_board_diagram under image-references/indexandnamingdiagram for more details
const boardPieceNeighborsMap: { [ boardPieceIndex: BoardPieceIndex_t ]: BoardPieceConnection[] } = {
    [ 0 as BoardPieceIndex_t ]: 
    [
        { neighborPieceIndex: 1 as BoardPieceIndex_t, neighborEdgeIndex: 3 as EdgeIndex_t, sourceEdgeIndex: 0 as EdgeIndex_t },
        { neighborPieceIndex: 3 as BoardPieceIndex_t, neighborEdgeIndex: 4 as EdgeIndex_t, sourceEdgeIndex: 1 as EdgeIndex_t },
        { neighborPieceIndex: 4 as BoardPieceIndex_t, neighborEdgeIndex: 5 as EdgeIndex_t, sourceEdgeIndex: 2 as EdgeIndex_t }
    ],
    [ 1 as BoardPieceIndex_t ]: 
    [
        { neighborPieceIndex: 0 as BoardPieceIndex_t, neighborEdgeIndex: 0 as EdgeIndex_t, sourceEdgeIndex: 3 as EdgeIndex_t },
        { neighborPieceIndex: 2 as BoardPieceIndex_t, neighborEdgeIndex: 4 as EdgeIndex_t, sourceEdgeIndex: 1 as EdgeIndex_t },
        { neighborPieceIndex: 3 as BoardPieceIndex_t, neighborEdgeIndex: 5 as EdgeIndex_t, sourceEdgeIndex: 2 as EdgeIndex_t }
    ],    
    [ 2 as BoardPieceIndex_t ] :
    [       
        { neighborPieceIndex: 1 as BoardPieceIndex_t, neighborEdgeIndex: 1 as EdgeIndex_t, sourceEdgeIndex: 4 as EdgeIndex_t },
        { neighborPieceIndex: 3 as BoardPieceIndex_t, neighborEdgeIndex: 0 as EdgeIndex_t, sourceEdgeIndex: 3 as EdgeIndex_t }
    ],    
    [ 3 as BoardPieceIndex_t ] :
    [       
        { neighborPieceIndex: 0 as BoardPieceIndex_t, neighborEdgeIndex: 1 as EdgeIndex_t, sourceEdgeIndex: 4 as EdgeIndex_t },
        { neighborPieceIndex: 1 as BoardPieceIndex_t, neighborEdgeIndex: 2 as EdgeIndex_t, sourceEdgeIndex: 5 as EdgeIndex_t },
        { neighborPieceIndex: 2 as BoardPieceIndex_t, neighborEdgeIndex: 3 as EdgeIndex_t, sourceEdgeIndex: 0 as EdgeIndex_t },
        { neighborPieceIndex: 4 as BoardPieceIndex_t, neighborEdgeIndex: 0 as EdgeIndex_t, sourceEdgeIndex: 3 as EdgeIndex_t },
        { neighborPieceIndex: 7 as BoardPieceIndex_t, neighborEdgeIndex: 5 as EdgeIndex_t, sourceEdgeIndex: 2 as EdgeIndex_t }
    ],        
    [ 4 as BoardPieceIndex_t ]:
    [        
        { neighborPieceIndex: 0 as BoardPieceIndex_t, neighborEdgeIndex: 2 as EdgeIndex_t, sourceEdgeIndex: 5 as EdgeIndex_t },
        { neighborPieceIndex: 3 as BoardPieceIndex_t, neighborEdgeIndex: 3 as EdgeIndex_t, sourceEdgeIndex: 0 as EdgeIndex_t },
        { neighborPieceIndex: 5 as BoardPieceIndex_t, neighborEdgeIndex: 0 as EdgeIndex_t, sourceEdgeIndex: 4 as EdgeIndex_t },
        { neighborPieceIndex: 6 as BoardPieceIndex_t, neighborEdgeIndex: 5 as EdgeIndex_t, sourceEdgeIndex: 2 as EdgeIndex_t },
        { neighborPieceIndex: 7 as BoardPieceIndex_t, neighborEdgeIndex: 4 as EdgeIndex_t, sourceEdgeIndex: 1 as EdgeIndex_t },
    ],    
    [ 5 as BoardPieceIndex_t ]:
    [
        { neighborPieceIndex: 4 as BoardPieceIndex_t, neighborEdgeIndex: 3 as EdgeIndex_t, sourceEdgeIndex: 0 as EdgeIndex_t },
        { neighborPieceIndex: 6 as BoardPieceIndex_t, neighborEdgeIndex: 4 as EdgeIndex_t, sourceEdgeIndex: 1 as EdgeIndex_t }
    ],    
    [ 6 as BoardPieceIndex_t ]: 
    [       
        { neighborPieceIndex: 4 as BoardPieceIndex_t, neighborEdgeIndex: 2 as EdgeIndex_t, sourceEdgeIndex: 5 as EdgeIndex_t },
        { neighborPieceIndex: 5 as BoardPieceIndex_t, neighborEdgeIndex: 1 as EdgeIndex_t, sourceEdgeIndex: 4 as EdgeIndex_t },
        { neighborPieceIndex: 7 as BoardPieceIndex_t, neighborEdgeIndex: 3 as EdgeIndex_t, sourceEdgeIndex: 0 as EdgeIndex_t }
    ],    
    [ 7 as BoardPieceIndex_t ]:
    [        
        { neighborPieceIndex: 3 as BoardPieceIndex_t, neighborEdgeIndex: 2 as EdgeIndex_t, sourceEdgeIndex: 5 as EdgeIndex_t },
        { neighborPieceIndex: 4 as BoardPieceIndex_t, neighborEdgeIndex: 1 as EdgeIndex_t, sourceEdgeIndex: 4 as EdgeIndex_t },
        { neighborPieceIndex: 6 as BoardPieceIndex_t, neighborEdgeIndex: 0 as EdgeIndex_t, sourceEdgeIndex: 3 as EdgeIndex_t }
    ]
};

// see board_piece_connection_diagram under image-references/indexandnamingdiagram for details
const lookupConnectedEdgeNodeIndicies: { [ sourceEdgeNodeIndex: EdgeNodeIndex_t ]: { linkedEdgeNodeIndex: EdgeNodeIndex_t, connectionDirectionAdjustment: number }[] } = {
    [0 as EdgeNodeIndex_t]: 
    [
        { linkedEdgeNodeIndex: 2 as EdgeNodeIndex_t,  connectionDirectionAdjustment: -1 },
        { linkedEdgeNodeIndex: 1 as EdgeNodeIndex_t,  connectionDirectionAdjustment: 0 },
    ],
    [1 as EdgeNodeIndex_t]:  
    [
        { linkedEdgeNodeIndex: 1 as EdgeNodeIndex_t,  connectionDirectionAdjustment: -1 },
        { linkedEdgeNodeIndex: 0 as EdgeNodeIndex_t,  connectionDirectionAdjustment: 0 },
    ],
    [2 as EdgeNodeIndex_t]:  
    [
        { linkedEdgeNodeIndex: 0 as EdgeNodeIndex_t,  connectionDirectionAdjustment: -1 },
    ],
    };

export function GenerateGameBoard( numberOfPieces: number )
{
    let iterateRandomTemplateIndicies = 0;
    let randomizedTemplateIndicies = randomizeTemplateNodes();
    let pieces: BoardPieceMap_t = {};
    let spaceCannonLocation: HexLocation_t | null = null;
    let planetsInPlay: NodeDescription[] = [];
    
    while ( Object.keys( pieces ).length < numberOfPieces) {
        const boardPieceIndex = Object.keys( pieces ).length as BoardPieceIndex_t;
        const templateIndex = randomizedTemplateIndicies[iterateRandomTemplateIndicies];
        const templateNodes = template[templateIndex];

        const spaceGunIndex = templateNodes.findIndex( ( node ) => node.type === NodeType.cannon ) as HexNodeIndex_t;
        if( spaceGunIndex > -1 )
        {
            spaceCannonLocation = { boardPieceIndex, hexNodeIndex: spaceGunIndex };
        }

        const planets = templateNodes.filter( ( node ) => {
            return node.type === NodeType.planet;
        })
        planetsInPlay.push( ...planets );

        const boardPiece = CreateBoardPiece( boardPieceIndex, templateIndex, templateNodes);
        try{
            pieces = addBoardPiece( pieces, boardPiece, boardPieceIndex );
            iterateRandomTemplateIndicies += 1;
        }
        catch ( e )
        {
            randomizedTemplateIndicies = randomizeTemplateNodes();
            iterateRandomTemplateIndicies = 0;
            spaceCannonLocation = null;
            planetsInPlay = [];
            pieces = {};
        }
    }
    const passengerDeck = GeneratePassengerDeck( planetsInPlay );

    if( spaceCannonLocation !== null)
       pieces = linkSpaceCannon( pieces, spaceCannonLocation );

    return { pieces, passengerDeck };
}

function randomizeTemplateNodes()
{
    const templateIndices = Array.from(Array(template.length).keys());

    if( !debugLinearTemplatePieces )
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
            return edgeNodeIndex as EdgeNodeIndex_t;
        }

        return undefined;
    });

    for (const edgeNodeIndexOfPlanet of edgeNodesIndiciesOfPlanets ) {
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
    let linkedPieces: BoardPieceMap_t = {...pieces, [ boardPieceIndex ]: boardPiece };
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
            const neighborNodesToLink = lookupConnectedEdgeNodeIndicies[ sourceEdgeNodeIndex as EdgeNodeIndex_t];
            for( let neighborEdgeNodeIndex = 0; neighborEdgeNodeIndex < neighborNodesToLink.length; neighborEdgeNodeIndex++ )
            {
                const neighborNodeIndex = neighborNodesToLink[neighborEdgeNodeIndex];
                linkedPieces = linkEdgeNodes( linkedPieces, 
                    { boardPieceIndex: boardPieceIndex, hexNodeIndex: sourceNodeIndex },
                    ValidateConnectionDirection( sourceEdgeInfo.edgeIndex - 1 + neighborEdgeNodeIndex), // connection direction on the source node to the neighbor node
                    { boardPieceIndex: boardPieceConnection.neighborPieceIndex, hexNodeIndex: neighborEdgeInfo.nodeIndices[ neighborNodeIndex.linkedEdgeNodeIndex ] },
                    ValidateConnectionDirection( neighborEdgeInfo.edgeIndex + neighborNodeIndex.connectionDirectionAdjustment), // connection direction on the neighbor node back to the source node 
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

// the rotational math is a bit black magic, don't ask me how i sussed it out
// because i've purged it from my memory at this point
function linkSpaceCannon( pieces:BoardPieceMap_t, spaceCannonLocation: HexLocation_t )
{
    const tempPieces = { ...pieces };
    const { boardPieceIndex: spaceCannonBoardPieceIndex, hexNodeIndex: spaceCannonHexNodeIndex } = spaceCannonLocation;
    const spaceCannonBoardPiece= tempPieces[spaceCannonBoardPieceIndex]
    const spaceCannonNode = spaceCannonBoardPiece.nodes[spaceCannonHexNodeIndex];

    // add the initial neighbors of the space cannon
    const neighborsToCheck : HexNodeNeighbor_t[]= [];
    spaceCannonNode.neighbors.forEach( (cannonNeighbor) => { 
        if( cannonNeighbor.connectionDirection === undefined)
            return;

        const bAddRotationToDirection = cannonNeighbor.location.boardPieceIndex !== spaceCannonBoardPieceIndex;
        const neighborRotation = bAddRotationToDirection ? pieces[cannonNeighbor.location.boardPieceIndex].rotation - spaceCannonBoardPiece.rotation : 0;
        neighborsToCheck.push( { location: cannonNeighbor.location, connectionDirection: ValidateConnectionDirection( cannonNeighbor.connectionDirection + neighborRotation )} );
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
                neighborsToCheck.push({ location: neighbor.location, connectionDirection: ValidateConnectionDirection( targetNeighbor.connectionDirection + neighborRotation ) })
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

function GeneratePassengerDeck( planetsInPlay: NodeDescription[] )
{
    const passengerDeck: PlanetTypes[] = [];
    planetsInPlay.forEach( ( planetDescription ) => 
    {
        if( planetDescription.name )
        {
            const passengers = Array(10).fill( planetDescription.name  );
            passengerDeck.push( ...passengers )
        }
    } )

    // Durstenfeld shuffle from SO
    for (var i = passengerDeck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = passengerDeck[i];
        passengerDeck[i] = passengerDeck[j];
        passengerDeck[j] = temp;
    }

    return passengerDeck;

}