import { configureStore } from "@reduxjs/toolkit";
import PlayerReducer from "./PlayerReducer";

export const store = configureStore({
    reducer: { playerState: PlayerReducer }
})

export type RootState = ReturnType<typeof store.getState>