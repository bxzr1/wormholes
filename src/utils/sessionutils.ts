import { RootState } from "../reducers/RootReducer";

const sessionkey = 'wormhole_game'
export function SaveGameSession( gameState: RootState)
{
    console.log( 'SAVE GAME')
    const isValidBoard = Object.keys( gameState.boardState.gameboard ).length > 0;
    const isValidPlayers = Object.keys( gameState.playerState.players ).length > 0;
    if( isValidBoard && isValidPlayers )
    {
        sessionStorage.setItem(sessionkey, JSON.stringify( gameState ));
    }
}

export function LoadGameSession(): RootState | null
{
    const gameState = sessionStorage.getItem(sessionkey);
    if( gameState )
        return JSON.parse( gameState )
    return null
}

export function ClearGameSession()
{
    sessionStorage.removeItem(sessionkey);
}