import { createSlice } from "@reduxjs/toolkit";
import { BoardPieceMap_t, GenerateGameBoard } from "../utils/gameboardutils";
import { BoardPiece_t } from "../utils/boardpieceutils";
import { HexLocation_t, HexNode_t } from "../utils/hexnodeutils";
import { RootState } from "./RootReducer";


export interface BoardState {
    gameboard: BoardPieceMap_t,
}
const initialState: { gameboard: BoardPieceMap_t }  = {
    gameboard: {}
}

const gameBoardSlice = createSlice({
    name: 'boardState',
    initialState: initialState,
    reducers: {
        initNewGame: ( state: BoardState, action: { payload: number } ) => {
           state.gameboard = GenerateGameBoard( action.payload )
        },
        initSavedBoard: ( state: BoardState, action: { payload: BoardState } ) => {
            state.gameboard = action.payload.gameboard
        },
        clearBoard: ( state: BoardState, action: {} ) => {
            state.gameboard = {};
        },
    }
})

export const selectGameBoard = (state: RootState) => state.board.gameboard;
export const selectBoardPiece = ( boardPieceIndex: number ) => ( state: RootState ): BoardPiece_t => state.board.gameboard[boardPieceIndex];
export const selectHexNode = ( location: HexLocation_t | undefined) => (state: RootState ): HexNode_t | null => 
{
    if( location )
    {
       return state.board.gameboard[location.boardPieceIndex].nodes[location.hexNodeIndex]
    }
    return null;
};
export const { initNewGame, initSavedBoard, clearBoard } = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
