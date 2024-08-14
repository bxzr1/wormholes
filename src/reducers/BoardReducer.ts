import { createSlice } from "@reduxjs/toolkit";
import { BoardPieceMap_t } from "../utils/gameboardutils";
import { BoardPiece_t } from "../utils/boardpieceutils";
import { HexLocation_t, HexNode_t } from "../utils/hexnodeutils";
import { RootState } from "./RootReducer";
import { BoardPieceIndex_t, ExplorationIndex_t, HexNodeIndex_t } from "../utils/aliasutils";
import { GetFuelCost, PlanetTypes } from "../template";

interface ExplorationCoin_t {
    explorationIndex: ExplorationIndex_t,
    victoryPoints: number
}

// values for 2-3 person exploration stack
const initialExplorationStack: ExplorationCoin_t[]= [
   { explorationIndex: 0 as ExplorationIndex_t, victoryPoints: 1 },
   { explorationIndex: 1 as ExplorationIndex_t, victoryPoints: 1 },
   { explorationIndex: 2 as ExplorationIndex_t, victoryPoints: 1 },
   { explorationIndex: 3 as ExplorationIndex_t, victoryPoints: 1 },
   { explorationIndex: 4 as ExplorationIndex_t, victoryPoints: 1 },
   { explorationIndex: 5 as ExplorationIndex_t, victoryPoints: 1 },
   { explorationIndex: 6 as ExplorationIndex_t, victoryPoints: 3 },
   { explorationIndex: 7 as ExplorationIndex_t, victoryPoints: 3 }
];

export interface BoardState {
    gameboard: BoardPieceMap_t,
    passengerDeck: PlanetTypes[],
    explorationStack: ExplorationCoin_t[],
}

const initialState: BoardState  = {
    gameboard: {},
    passengerDeck: [],
    explorationStack: []
}

const gameBoardSlice = createSlice({
    name: 'boardState',
    initialState: initialState,
    reducers: {
        initNewGame: ( state: BoardState, action: { payload: BoardPieceMap_t } ) => {
            state.gameboard = action.payload;
            state.explorationStack = initialExplorationStack;
        },
        initSavedBoard: ( state: BoardState, action: { payload: BoardState } ) => {
            state.gameboard = action.payload.gameboard;
            state.explorationStack = action.payload.explorationStack;
        },
        clearBoard: ( state: BoardState, action: {} ) => {
            state.gameboard = {};
            state.explorationStack = [];
        },
    }
})


export const selectExplorationStack = (state: RootState) => state.boardState.explorationStack;
export const selectGameBoard = (state: RootState) => state.boardState.gameboard;
export const selectBoardPiece = ( boardPieceIndex: BoardPieceIndex_t ) => ( state: RootState ): BoardPiece_t => state.boardState.gameboard[boardPieceIndex];
export const selectHexNode = ( location: HexLocation_t | null ) => (state: RootState ): HexNode_t | null => 
{
    if( location )
    {
       return state.boardState.gameboard[location.boardPieceIndex].nodes[location.hexNodeIndex]
    }
    return null;
};

interface MapTraversableNeighborsToCost_t { [ boardPieceIndex: BoardPieceIndex_t ] : { [ hexNodeIndex: HexNodeIndex_t ] : number } };
export const selectHexNodeMoveableNeighborCosts = ( location: HexLocation_t | null, availableFuel: number ) => (state: RootState ) => 
{
    let mapTraversableNeighbors: MapTraversableNeighborsToCost_t = {}; 
    if( location && availableFuel )
    {
        mapTraversableNeighbors = { [ location.boardPieceIndex ] : { [ location.hexNodeIndex] : 0 } };
        mapTraversableNeighbors = GenerateTraversableNeighbors( state.boardState.gameboard, mapTraversableNeighbors, location, availableFuel, 0 );
    }
    return mapTraversableNeighbors;
};

function GenerateTraversableNeighbors( boardPieceMap: BoardPieceMap_t, mapNeighbors: MapTraversableNeighborsToCost_t, targetLocation: HexLocation_t, startingFuel: number, spentFuel: number )
{        
    const targetNode = boardPieceMap[targetLocation.boardPieceIndex].nodes[targetLocation.hexNodeIndex];
    const neighbors = targetNode.neighbors
    neighbors.forEach( ( neighbor ) => {
        const neighborLocation = neighbor.location;
        const fuelCost = spentFuel + GetFuelCost( targetNode.nodeType );
        if( fuelCost <= startingFuel )
        {
            const recordedTraversalCost = mapNeighbors[neighborLocation.boardPieceIndex] ? mapNeighbors[neighborLocation.boardPieceIndex][neighborLocation.hexNodeIndex] : undefined;
            if( recordedTraversalCost === undefined || fuelCost < recordedTraversalCost )
            {
                mapNeighbors = { 
                    ...mapNeighbors,
                    [ neighborLocation.boardPieceIndex ] : {
                        ...mapNeighbors[neighborLocation.boardPieceIndex],
                        [neighborLocation.hexNodeIndex]: fuelCost
                    }
                }

                mapNeighbors = GenerateTraversableNeighbors( boardPieceMap, mapNeighbors, neighborLocation, startingFuel, fuelCost )
            };
        }
    })

    return mapNeighbors;
}


export const boardActions = gameBoardSlice.actions;
export default gameBoardSlice.reducer;
