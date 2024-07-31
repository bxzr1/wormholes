import { HexNode_t, HexNodeNeighbor_t } from "./hexnodeutils";
import { NodeDescription, NodeType } from "../template";
import { debugLinearRotations } from "./debugutils";
import { BoardPieceIndex_t, ConnectionDirection_t, EdgeIndex_t, GridNodeIndex_t, HexNodeIndex_t } from "./aliasutils";

// see hexnode_diagram under image-references/indexandnamingdiagram for more details
const neighborsMap: { [sourceHexNodeIndex: HexNodeIndex_t]: { connectionDirection: ConnectionDirection_t, neighborHexNodeIndex: HexNodeIndex_t }[] } = {
	[0 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 1 as HexNodeIndex_t },
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 4 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 3 as HexNodeIndex_t },
	],
	[1 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 2 as HexNodeIndex_t },
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 5 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 4 as HexNodeIndex_t }, 
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 0 as HexNodeIndex_t },
	],
	[2 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 6 as HexNodeIndex_t},
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 5 as HexNodeIndex_t},
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 1 as HexNodeIndex_t},
	],
	[3 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 0 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 4 as HexNodeIndex_t },
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 8 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 7 as HexNodeIndex_t }, 
	],
	[4 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 1 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 3 as HexNodeIndex_t }, 
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 5 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 8 as HexNodeIndex_t },
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 9 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 0 as HexNodeIndex_t },
	],
	[5 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 2 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 4 as HexNodeIndex_t }, 
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 6 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 9 as HexNodeIndex_t },
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 10 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 1 as HexNodeIndex_t },
	],
	[6 as HexNodeIndex_t ]: 
	[ 
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 11 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 10 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 5 as HexNodeIndex_t }, 
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 2 as HexNodeIndex_t },
	],
	[7 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 3 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 8 as HexNodeIndex_t },
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 12 as HexNodeIndex_t }, 
	],
	[8 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 4 as HexNodeIndex_t},
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 9 as HexNodeIndex_t}, 
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 13 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 12 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 7 as HexNodeIndex_t},
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 3 as HexNodeIndex_t},
	],
	[9 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 5 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 10 as HexNodeIndex_t }, 
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 14 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 13 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 8 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 4 as HexNodeIndex_t },
	],
	[10 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 6 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 11 as HexNodeIndex_t }, 
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 15 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 14 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 9 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 5 as HexNodeIndex_t },
	],
	[11 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 15 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 10 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 6 as HexNodeIndex_t},
	],
	[12 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 8 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 13 as HexNodeIndex_t }, 
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 16 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 7 as HexNodeIndex_t },
	],
	[13 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 9 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 14 as HexNodeIndex_t }, 
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 17 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 16 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 12 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 8 as HexNodeIndex_t },
	],
	[14 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 10 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 15 as HexNodeIndex_t }, 
		{ connectionDirection: 2 as ConnectionDirection_t, neighborHexNodeIndex: 18 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 17 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 13 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 9 as HexNodeIndex_t },
	],
	[15 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 11 as HexNodeIndex_t },
		{ connectionDirection: 3 as ConnectionDirection_t, neighborHexNodeIndex: 18 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 14 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 10 as HexNodeIndex_t },
	],
	[16 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 13 as HexNodeIndex_t },
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 17 as HexNodeIndex_t }, 
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 12 as HexNodeIndex_t },
	],
	[17 as HexNodeIndex_t ]: 
	[
	    { connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 14 as HexNodeIndex_t},
		{ connectionDirection: 1 as ConnectionDirection_t, neighborHexNodeIndex: 18 as HexNodeIndex_t}, 
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 16 as HexNodeIndex_t},
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 13 as HexNodeIndex_t},
	],
	[18 as HexNodeIndex_t ]: 
	[
		{ connectionDirection: 0 as ConnectionDirection_t, neighborHexNodeIndex: 15 as HexNodeIndex_t },
		{ connectionDirection: 4 as ConnectionDirection_t, neighborHexNodeIndex: 17 as HexNodeIndex_t },
		{ connectionDirection: 5 as ConnectionDirection_t, neighborHexNodeIndex: 14 as HexNodeIndex_t },
	],
};

// CW order
const edgesMap: { [ edgeIndex: EdgeIndex_t ]: HexNodeIndex_t[] } = {
	[ 0 as EdgeIndex_t ]: 
	[
		0 as HexNodeIndex_t, 
		1 as HexNodeIndex_t, 
		2 as HexNodeIndex_t,
	],
	[ 1 as EdgeIndex_t ]: 
	[
		2 as HexNodeIndex_t, 
		6 as HexNodeIndex_t, 
		11 as HexNodeIndex_t, 
	],
	[ 2 as EdgeIndex_t ]: 
	[
		11 as HexNodeIndex_t, 
		15 as HexNodeIndex_t,
		18 as HexNodeIndex_t,
	],
	[ 3 as EdgeIndex_t ]: 
	[
		18 as HexNodeIndex_t, 
		17 as HexNodeIndex_t, 
		16 as HexNodeIndex_t 
	],
	[ 4 as EdgeIndex_t ]: 
	[
		16 as HexNodeIndex_t, 
		12 as HexNodeIndex_t, 
		7 as HexNodeIndex_t 
	],
	[ 5 as EdgeIndex_t ]: 
	[
		7 as HexNodeIndex_t, 
		3 as HexNodeIndex_t, 
		0 as HexNodeIndex_t 
	],
}

// CCW order
// const edgesMap: { [edgeIndex: EdgeIndex_t]: HexNodeIndex_t[] } = {
// 0: [0, 1, 2],
// 5: [7, 3, 0],
// 4: [16, 12, 7],
// 3: [18, 17, 16],
// 2: [11, 15, 18],
// 1: [2, 6, 11],
// }

export const rotationLookup: { [hexNodeIndex: GridNodeIndex_t]: HexNodeIndex_t[] } = {
	
	// Clockwise table
	[0  as GridNodeIndex_t] :[0  as HexNodeIndex_t, 2  as HexNodeIndex_t, 11 as HexNodeIndex_t, 18 as HexNodeIndex_t, 16 as HexNodeIndex_t, 7  as HexNodeIndex_t],
	[1  as GridNodeIndex_t] :[1  as HexNodeIndex_t, 6  as HexNodeIndex_t, 15 as HexNodeIndex_t, 17 as HexNodeIndex_t, 12 as HexNodeIndex_t, 3  as HexNodeIndex_t],
	[2  as GridNodeIndex_t] :[2  as HexNodeIndex_t, 11 as HexNodeIndex_t, 18 as HexNodeIndex_t, 16 as HexNodeIndex_t, 7  as HexNodeIndex_t, 0  as HexNodeIndex_t],
	[3  as GridNodeIndex_t] :[3  as HexNodeIndex_t, 1  as HexNodeIndex_t, 6  as HexNodeIndex_t, 15 as HexNodeIndex_t, 17 as HexNodeIndex_t, 12 as HexNodeIndex_t],
	[4  as GridNodeIndex_t] :[4  as HexNodeIndex_t, 5  as HexNodeIndex_t, 10 as HexNodeIndex_t, 14 as HexNodeIndex_t, 13 as HexNodeIndex_t, 8  as HexNodeIndex_t],
	[5  as GridNodeIndex_t] :[5  as HexNodeIndex_t, 10 as HexNodeIndex_t, 14 as HexNodeIndex_t, 13 as HexNodeIndex_t, 8  as HexNodeIndex_t, 4  as HexNodeIndex_t],
	[6  as GridNodeIndex_t] :[6  as HexNodeIndex_t, 15 as HexNodeIndex_t, 17 as HexNodeIndex_t, 12 as HexNodeIndex_t, 3  as HexNodeIndex_t, 1  as HexNodeIndex_t],
	[7  as GridNodeIndex_t] :[7  as HexNodeIndex_t, 0  as HexNodeIndex_t, 2  as HexNodeIndex_t, 11 as HexNodeIndex_t, 18 as HexNodeIndex_t, 16 as HexNodeIndex_t],
	[8  as GridNodeIndex_t] :[8  as HexNodeIndex_t, 4  as HexNodeIndex_t, 5  as HexNodeIndex_t, 10 as HexNodeIndex_t, 14 as HexNodeIndex_t, 13 as HexNodeIndex_t],
	[9  as GridNodeIndex_t] :[9  as HexNodeIndex_t, 9  as HexNodeIndex_t, 9  as HexNodeIndex_t, 9  as HexNodeIndex_t, 9  as HexNodeIndex_t, 9  as HexNodeIndex_t],
	[10 as GridNodeIndex_t] :[10 as HexNodeIndex_t, 14 as HexNodeIndex_t, 13 as HexNodeIndex_t, 8  as HexNodeIndex_t, 4  as HexNodeIndex_t, 5  as HexNodeIndex_t],
	[11 as GridNodeIndex_t] :[11 as HexNodeIndex_t, 18 as HexNodeIndex_t, 16 as HexNodeIndex_t, 7  as HexNodeIndex_t, 0  as HexNodeIndex_t, 2  as HexNodeIndex_t],
	[12 as GridNodeIndex_t] :[12 as HexNodeIndex_t, 3  as HexNodeIndex_t, 1  as HexNodeIndex_t, 6  as HexNodeIndex_t, 15 as HexNodeIndex_t, 17 as HexNodeIndex_t],
	[13 as GridNodeIndex_t] :[13 as HexNodeIndex_t, 8  as HexNodeIndex_t, 4  as HexNodeIndex_t, 5  as HexNodeIndex_t, 10 as HexNodeIndex_t, 14 as HexNodeIndex_t],
	[14 as GridNodeIndex_t] :[14 as HexNodeIndex_t, 13 as HexNodeIndex_t, 8  as HexNodeIndex_t, 4  as HexNodeIndex_t, 5  as HexNodeIndex_t, 10 as HexNodeIndex_t],
	[15 as GridNodeIndex_t] :[15 as HexNodeIndex_t, 17 as HexNodeIndex_t, 12 as HexNodeIndex_t, 3  as HexNodeIndex_t, 1  as HexNodeIndex_t, 6  as HexNodeIndex_t],
	[16 as GridNodeIndex_t] :[16 as HexNodeIndex_t, 7  as HexNodeIndex_t, 0  as HexNodeIndex_t, 2  as HexNodeIndex_t, 11 as HexNodeIndex_t, 18 as HexNodeIndex_t],
	[17 as GridNodeIndex_t] :[17 as HexNodeIndex_t, 12 as HexNodeIndex_t, 3  as HexNodeIndex_t, 1  as HexNodeIndex_t, 6  as HexNodeIndex_t, 15 as HexNodeIndex_t],
	[18 as GridNodeIndex_t] :[18 as HexNodeIndex_t, 16 as HexNodeIndex_t, 7  as HexNodeIndex_t, 0  as HexNodeIndex_t, 2  as HexNodeIndex_t, 11 as HexNodeIndex_t]
	
	
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
			hexNodeIndex: hexNodeIndex as HexNodeIndex_t,
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
		const neighborData = neighborsMap[ index as HexNodeIndex_t ];
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
	const actualEdgeIndex = (requestedEdgeIndex + boardPiece.rotation) % 6 as EdgeIndex_t;
	return { nodeIndices: edgesMap[actualEdgeIndex], edgeIndex: actualEdgeIndex };
}

export function GetRotatedNodeAtIndex( sourceHexNodeIndex: GridNodeIndex_t, boardPiece: BoardPiece_t )
{
	const lookupIndices = rotationLookup[sourceHexNodeIndex];
	const hexNodeIndex = lookupIndices[boardPiece.rotation];
	const rotatedNode = boardPiece.nodes[hexNodeIndex];
	return rotatedNode;
}