import { createSlice } from "@reduxjs/toolkit";
import { Player } from "./Player";
import { HexNode } from "./HexNode";
import { RootState } from "./store";

interface PlayerState {
    currentPlayer: number;
    players: Map<string, Player>;
}

const playerSlice = createSlice({
    name: 'playerState',
    initialState: {
        currentPlayer: -1,
        players: new Map()
    },
    reducers: {
        addPlayer: (state: PlayerState, action: { payload: Player }) => {
            state.players.set(action.payload.getName(), action.payload);
        },
        movePlayer: (state: PlayerState, action: { payload: { playerName: string, hex: HexNode } }) => {
            const player = state.players.get(action.payload.playerName);
            if (player) {
                player.setHex(action.payload.hex);
            }
        }
    }
})

export const selectPlayers = (state: RootState) => state.playerState.players;
export const selectNumPlayers = (state: RootState) => state.playerState.players.size;
export const { addPlayer, movePlayer } = playerSlice.actions;

export default playerSlice.reducer;
