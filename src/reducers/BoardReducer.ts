import { createSlice } from "@reduxjs/toolkit";
import { BoardPieceMap_t, GenerateGameBoard } from "../utils/gameboardutils";
import { BoardPiece_t } from "../utils/boardpieceutils";
import { HexLocation_t, HexNode_t } from "../utils/hexnodeutils";
import { RootState } from "./RootReducer";
import { BoardPieceIndex_t, ExplorationIndex_t } from "../utils/aliasutils";
import { PlanetTypes } from "../template";

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
        initNewGame: ( state: BoardState, action: { payload: number } ) => {
            const { pieces, passengerDeck } = GenerateGameBoard( action.payload )
            state.gameboard = pieces;
            state.passengerDeck = passengerDeck;
            state.explorationStack = initialExplorationStack;
        },
        initSavedBoard: ( state: BoardState, action: { payload: BoardState } ) => {
            state.gameboard = action.payload.gameboard;
            state.passengerDeck = action.payload.passengerDeck;
            state.explorationStack = action.payload.explorationStack;
        },
        clearBoard: ( state: BoardState, action: {} ) => {
            state.gameboard = {};
            state.passengerDeck = [];
            state.explorationStack = [];
        },
    }
})


export const selectExplorationStack = (state: RootState) => state.boardState.explorationStack;
export const selectPassengerDeck = (state: RootState) => state.boardState.passengerDeck;
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

export const boardActions = gameBoardSlice.actions;
export default gameBoardSlice.reducer;
