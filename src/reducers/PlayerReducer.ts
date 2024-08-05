import { createSlice } from "@reduxjs/toolkit";
import { Player_t } from "../utils/playerutils";
import { RootState } from "./RootReducer";
import { HexLocation_t } from "../utils/hexnodeutils";
import { PlayerIndex_t } from "../utils/aliasutils";

interface PlayerMap_t { [ playerIndex: PlayerIndex_t ] : Player_t };
interface PlayerState {
    currentPlayer: PlayerIndex_t;
    players: PlayerMap_t;
}

const playerSlice = createSlice({
    name: 'playerState',
    initialState: {
        currentPlayer: -1 as PlayerIndex_t, 
        players: {} as PlayerMap_t,
    },
    reducers: {
        clearPlayers: ( state: PlayerState, action: {} ) => {
            state.currentPlayer = -1 as PlayerIndex_t;
            state.players = {};
        },
        initSavedPlayers: ( state: PlayerState, action: { payload: PlayerState } ) => {
            state.currentPlayer = action.payload.currentPlayer;
            state.players = action.payload.players;
        },
        addPlayer: (state: PlayerState, action: { payload: Player_t }) => {
            state.players[action.payload.playerIndex] = action.payload;
        },
        movePlayer: ( state: PlayerState, action: { payload: { playerIndex: PlayerIndex_t, hex: HexLocation_t } } ) => {
            state.players[action.payload.playerIndex].hexLocation = action.payload.hex;
        },
        changeCurrentPlayer: ( state: PlayerState, action: { payload: { playerIndex: PlayerIndex_t } } ) => {
            state.currentPlayer = action.payload.playerIndex;
        }
    }
})

export const selectPlayers = (state: RootState): PlayerMap_t => { 
    return state.playerState.players 
};

export const selectPlayersAtLocation = ( location: HexLocation_t | undefined) => (state: RootState ): Player_t[] => 
{
    if( location )
    {
        const validPlayers: Player_t[] = [];
        const players: Player_t[] = Object.values( state.playerState.players );
        players.forEach( ( player ) => {
            if(  player.hexLocation && 
                player.hexLocation.boardPieceIndex === location.boardPieceIndex && 
                player.hexLocation.hexNodeIndex === location.hexNodeIndex
            )
            {
                validPlayers.push( player);
            }
        })
        return validPlayers;
    }
    return [];
};

export const selectNumPlayers = (state: RootState) => Object.keys(state.playerState.players).length;
export const { clearPlayers, initSavedPlayers, addPlayer, movePlayer } = playerSlice.actions;

export default playerSlice.reducer;
