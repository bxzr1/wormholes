import { createBrowserRouter } from "react-router-dom";
import { AddPlayers } from "./pages/AddPlayersPage";
import { InitGame } from "./InitGame";
import GameSession from "./pages/GameSessionPage";

export const rootRouter = createBrowserRouter(
    [
        {
            path: "/",
            element: <InitGame/>,
        },
        {
            path: "/addplayers",
            element: <AddPlayers/>,
        },
        {
            path: "/play",
            element: <GameSession/>,
        },
    ]
);