import { createSlice } from "@reduxjs/toolkit";
import { initialPassengersPerPlayer, Player_t } from "../utils/playerutils";
import { RootState } from "./RootReducer";
import { HexLocation_t } from "../utils/hexnodeutils";
import { PlayerIndex_t } from "../utils/aliasutils";
import { PlanetTypes } from "../template";

interface PlayerMap_t { [ playerIndex: PlayerIndex_t ] : Player_t };
interface PlayerState {
    currentPlayer: PlayerIndex_t;
    players: PlayerMap_t;
    passengerDeck: PlanetTypes[];
}

const playerSlice = createSlice({
    name: 'playerState',
    initialState: {
        currentPlayer: -1 as PlayerIndex_t, 
        players: {} as PlayerMap_t,
        passengerDeck: []
    },
    reducers: {
        clearPlayers: ( state: PlayerState, action: {} ) => {
            state.currentPlayer = -1 as PlayerIndex_t;
            state.passengerDeck= [];
            state.players = {};
        },
        initSavedPlayerState: ( state: PlayerState, action: { payload: PlayerState } ) => {
            state.currentPlayer = action.payload.currentPlayer;
            state.passengerDeck = action.payload.passengerDeck;
            state.players = action.payload.players;
        },
        initPassengerDeck: ( state: PlayerState, action: { payload: PlanetTypes[] } ) => {
            const deck = action.payload;
            const players: Player_t[] = Object.values( state.players );
            players.forEach( ( player ) => {
                const playerIndex = player.playerIndex;
                const numPassengers = initialPassengersPerPlayer[ playerIndex ]; 
                const initPassengers = deck.splice( 0, numPassengers ); 
                state.players[ playerIndex ] = {...state.players[ playerIndex ], passengers: initPassengers }
            })
            state.passengerDeck = deck;
        },
        addPlayer: (state: PlayerState, action: { payload: Player_t }) => {
            state.players[action.payload.playerIndex] = action.payload;
        },
        movePlayer: ( state: PlayerState, action: { payload: { playerIndex: PlayerIndex_t, hex: HexLocation_t } } ) => {
            state.players[action.payload.playerIndex].hexLocation = action.payload.hex;
        },
        changeCurrentPlayer: ( state: PlayerState, action: { payload: PlayerIndex_t } ) => {
            state.currentPlayer = action.payload;
        },
        pickupPassengers: ( state: PlayerState, action: { payload: number } ) => {
            if( state.currentPlayer >= 0 )
            {
                const deck = [ ...state.passengerDeck ];
                const passengers = deck.splice( 0, action.payload );
                const currentPlayer = state.players[ state.currentPlayer ];
                state.players[ state.currentPlayer ] = {
                    ...currentPlayer,
                    passengers: [...currentPlayer.passengers, ...passengers],
                    hasPickedUp: true,
                }
                state.passengerDeck = deck;
            }
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

export const selectCurrentPlayerIndex = (state: RootState): PlayerIndex_t => { 
    return state.playerState.currentPlayer 
};

export const selectCurrentPlayer = (state: RootState): Player_t | null => { 
    const currentPlayerIndex = state.playerState.currentPlayer;
    if( currentPlayerIndex >= 0 )
    {
        return state.playerState.players[currentPlayerIndex];
    }
    return null;
};

export const selectCurrentPlayerLocation = (state: RootState): HexLocation_t | null => { 
    const currentPlayerIndex = state.playerState.currentPlayer;
    if( currentPlayerIndex >= 0 )
    {
        return state.playerState.players[currentPlayerIndex].hexLocation;
    }
    return null;
};

export const selectPassengerDeck = (state: RootState): PlanetTypes[] => { 
    return state.playerState.passengerDeck 
};

export const selectPassengersForPlayer = ( playerIndex: PlayerIndex_t ) => (state: RootState ): PlanetTypes[] => 
{
    return state.playerState.players[playerIndex].passengers; 
};


export const selectNumPlayers = (state: RootState) => Object.keys(state.playerState.players).length;
export const playerActions = playerSlice.actions;

export default playerSlice.reducer;
