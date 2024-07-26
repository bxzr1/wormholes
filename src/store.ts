import { configureStore } from "@reduxjs/toolkit";
import PlayerReducer from "./reducers/PlayerReducer";
import BoardReducer from "./reducers/BoardReducer";

export const store = configureStore({
    reducer: { 
        playerState: PlayerReducer,
        board: BoardReducer,
     }
})

export type RootState = ReturnType<typeof store.getState>