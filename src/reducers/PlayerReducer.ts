import { createSlice } from "@reduxjs/toolkit";
import { Player_t } from "../utils/playerutils";
import { RootState } from "./RootReducer";
import { HexLocation_t } from "../utils/hexnodeutils";

interface PlayerState {
    currentPlayer: number;
    players: {[playerName: string ] : Player_t};
}

const playerSlice = createSlice({
    name: 'playerState',
    initialState: {
        currentPlayer: -1,
        players: {}
    },
    reducers: {
        clearPlayers: ( state: PlayerState, action: {} ) => {
            state = { currentPlayer: -1, players: {} };
        },
        initSavedPlayers: ( state: PlayerState, action: { payload: PlayerState } ) => {
            state = action.payload;
        },
        addPlayer: (state: PlayerState, action: { payload: Player_t }) => {
            state.players[action.payload.name] = action.payload;
        },
        movePlayer: (state: PlayerState, action: { payload: { playerName: string, hex: HexLocation_t } }) => {
            state.players[action.payload.playerName].hexLocation = action.payload.hex;
        }
    }
})

export const selectPlayers = (state: RootState): { [ playerName: string] : Player_t} => state.playerState.players;
export const selectNumPlayers = (state: RootState) => Object.keys(state.playerState.players).length;
export const { clearPlayers, initSavedPlayers, addPlayer, movePlayer } = playerSlice.actions;

export default playerSlice.reducer;
