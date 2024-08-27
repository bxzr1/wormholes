import { createSlice } from "@reduxjs/toolkit";
import { initialPassengersPerPlayer, k_fuelPerRound, Player_t, Wormhole } from "../utils/playerutils";
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
        movePlayer: ( state: PlayerState, action: { payload: { playerIndex: PlayerIndex_t, hex: HexLocation_t, fuelCost: number } } ) => {
            const player =  state.players[action.payload.playerIndex];
            state.players[action.payload.playerIndex] = {
                ...player, 
                hexLocation: action.payload.hex,
                fuelLeft: player.fuelLeft - action.payload.fuelCost
            };
        },
        placeWormhole: ( state: PlayerState, action: { payload: { playerIndex: PlayerIndex_t, hex: HexLocation_t } } ) => {
            // TODO: Figure out how to actually connect wormholes on the board
            const player = state.players[action.payload.playerIndex];
            const nextWormholeIndex = player.wormholes.findIndex( ( wormhole ) => wormhole.locationA === null || wormhole.locationB === null )
            if( nextWormholeIndex > -1 )
            {
                const nextWormhole = player.wormholes[nextWormholeIndex];
                if( nextWormhole.locationA === null )
                {
                    state.players[action.payload.playerIndex].wormholes[nextWormholeIndex] = {
                        ...nextWormhole,
                        locationA: action.payload.hex
                    };
                }
                else 
                {
                    state.players[action.payload.playerIndex].wormholes[nextWormholeIndex] = {
                        ...nextWormhole,
                        locationB: action.payload.hex,
                        active: true,
                    };
                }
            }
        },
        endTurn: ( state: PlayerState, action: { payload: PlayerIndex_t } ) => {
            state.players[action.payload] = {
                ...state.players[action.payload],
                fuelLeft: k_fuelPerRound,
                hasPickedUp: false,
            };
            const numPlayers = Object.keys( state.players ).length;
            state.currentPlayer = ( state.currentPlayer + 1 ) % numPlayers as PlayerIndex_t; 

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

export const selectWormholesAtLocation = ( location: HexLocation_t | undefined) => (state: RootState ): Wormhole[] => 
{
    if( location )
    {
        const wormholes: Wormhole[] = [];
        const players: Player_t[] = Object.values( state.playerState.players );
        players.forEach( ( player ) => {
            player.wormholes.forEach( ( wormhole ) => {
                const wormholeAOnLocation = wormhole.locationA && 
                wormhole.locationA?.boardPieceIndex === location.boardPieceIndex && 
                wormhole.locationA?.hexNodeIndex === location.hexNodeIndex;

                const wormholeBOnLocation = wormhole.locationB && 
                wormhole.locationB?.boardPieceIndex === location.boardPieceIndex && 
                wormhole.locationB?.hexNodeIndex === location.hexNodeIndex
                if( wormholeAOnLocation || wormholeBOnLocation )
                {
                    wormholes.push( wormhole)
                }
            } )
        })

        if( wormholes.length > 1 )
        {
            console.log('error: too many wormholes on node')
        }
        return wormholes;
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
