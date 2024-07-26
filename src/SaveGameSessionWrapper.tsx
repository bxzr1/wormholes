import { useEffect } from "react"
import { store } from "./reducers/RootReducer"
import { SaveGameSession } from "./utils/sessionutils"

export function SaveGameSessionWrapper( props: { children: React.ReactNode })
{
  
    useEffect( () => {
        const fnSaveGameSession = () => {
            const gameState = store.getState()
            SaveGameSession( gameState )
        }

        window.addEventListener('beforeunload', fnSaveGameSession)
        return () => window.removeEventListener('beforeunload', fnSaveGameSession)
    }, [])

    return <>{ props.children }</>   
}