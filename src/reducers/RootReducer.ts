import { configureStore, combineReducers } from "@reduxjs/toolkit"
import PlayerReducer from "./PlayerReducer";
import BoardReducer from "./BoardReducer";
import { SaveGameSession } from "../utils/sessionutils";

// REDUCERS
export const rootReducer = combineReducers( {
    playerState: PlayerReducer,
    boardState: BoardReducer,
})

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>

// SELECTORS
export const selectGameState = (state: RootState) => state;

export const saveGameState = () => 
{
    const state = store.getState();
    SaveGameSession( state );
};