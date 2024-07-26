import { configureStore, combineReducers } from "@reduxjs/toolkit"
import PlayerReducer from "./PlayerReducer";
import BoardReducer from "./BoardReducer";

// REDUCERS
export const rootReducer = combineReducers( {
    playerState: PlayerReducer,
    board: BoardReducer,
})

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>

// SELECTORS
export const selectGameState = (state: RootState) => state;