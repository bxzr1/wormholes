import { createSlice } from "@reduxjs/toolkit";
import { BoardPieceMap_t, GenerateGameBoard } from "../utils/gameboardutils";
import { BoardPiece_t } from "../utils/boardpieceutils";
import { HexLocation_t, HexNode_t } from "../utils/hexnodeutils";
import { RootState } from "./RootReducer";
import { BoardPieceIndex_t } from "../utils/aliasutils";

// values for 2-3 person exploration stack
const initialExplorationStack= [ 1,1,1,1,1,1,3,3];

export interface BoardState {
    gameboard: BoardPieceMap_t,
    explorationStack: number[],
}
const initialState: BoardState  = {
    gameboard: {},
    explorationStack: initialExplorationStack
}

const gameBoardSlice = createSlice({
    name: 'boardState',
    initialState: initialState,
    reducers: {
        initNewGame: ( state: BoardState, action: { payload: number } ) => {
           state.gameboard = GenerateGameBoard( action.payload )
        },
        initSavedBoard: ( state: BoardState, action: { payload: BoardState } ) => {
            state.gameboard = action.payload.gameboard;
            state.explorationStack = action.payload.explorationStack;
        },
        clearBoard: ( state: BoardState, action: {} ) => {
            state.gameboard = {};
        },
    }
})

export const selectGameBoard = (state: RootState) => state.boardState.gameboard;
export const selectBoardPiece = ( boardPieceIndex: BoardPieceIndex_t ) => ( state: RootState ): BoardPiece_t => state.boardState.gameboard[boardPieceIndex];
export const selectHexNode = ( location: HexLocation_t | undefined) => (state: RootState ): HexNode_t | null => 
{
    if( location )
    {
       return state.boardState.gameboard[location.boardPieceIndex].nodes[location.hexNodeIndex]
    }
    return null;
};
export const { initNewGame, initSavedBoard, clearBoard } = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
