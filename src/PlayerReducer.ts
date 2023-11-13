import { createSlice } from "@reduxjs/toolkit";
import { Player } from "./Player";
import { HexNode } from "./HexNode";
import { RootState } from "./store";

interface PlayerState {
    currentPlayer: number;
    players: {[playerName: string ] : Player};
}

const playerSlice = createSlice({
    name: 'playerState',
    initialState: {
        currentPlayer: -1,
        players: {}
    },
    reducers: {
        addPlayer: (state: PlayerState, action: { payload: Player }) => {
            state.players[action.payload.getName()] = action.payload;
        },
        movePlayer: (state: PlayerState, action: { payload: { playerName: string, hex: HexNode } }) => {
            const player = state.players[action.payload.playerName];
            if (player) {
                player.setHex(action.payload.hex);
            }
        }
    }
})

export const selectPlayers = (state: RootState): { [ playerName: string] : Player} => state.playerState.players;
export const selectNumPlayers = (state: RootState) => Object.keys(state.playerState.players).length;
export const { addPlayer, movePlayer } = playerSlice.actions;

export default playerSlice.reducer;
