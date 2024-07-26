import { createSlice } from "@reduxjs/toolkit";
import { BoardPieceMap_t, GenerateGameBoard } from "../gameboard/GameBoard";
import { BoardPiece_t } from "../gameboard/BoardPiece";
import { HexLocation_t, HexNode_t } from "../gameboard/HexNode";
import { RootState } from "../store";


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
        initGame: ( state: BoardState, action: { payload: number } ) => {
           state.gameboard = GenerateGameBoard( action.payload )
        },
    }
})
export const selectGameBoard = (state: RootState) => state.board.gameboard;
export const selectBoardPiece = ( boardPieceID: number ) => ( state: RootState ): BoardPiece_t => state.board.gameboard[boardPieceID];
export const selectHexNode = ( location: HexLocation_t | undefined) => (state: RootState ): HexNode_t | null => 
{
    if( location )
    {
       return state.board.gameboard[location.boardPieceID].nodes[location.hexNodeID]
    }
    return null;
};
export const { initGame } = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
