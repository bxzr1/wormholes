import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initSavedBoard } from "./reducers/BoardReducer";
import { LoadGameSession } from "./utils/sessionutils";
import { initSavedPlayers } from "./reducers/PlayerReducer";
import { useNavigate } from "react-router-dom";

export function InitGame()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const savedState = LoadGameSession();
        if( savedState )
        {
            const isValidBoard = Object.keys( savedState.boardState.gameboard ).length > 0;
            const isValidPlayers = Object.keys( savedState.playerState.players ).length > 0;
            if( isValidBoard && isValidPlayers )
            {
                dispatch( initSavedBoard( savedState.boardState ) );
                dispatch( initSavedPlayers( savedState.playerState ) );
                navigate( '/play' );
                return;
            }
        }
        
        navigate( '/addplayers' );
    }, [ dispatch, navigate ]);

    return null;
}